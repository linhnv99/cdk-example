import * as lambda from "@aws-cdk/aws-lambda";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import * as cdk from "@aws-cdk/core";
import * as appsync from '@aws-cdk/aws-appsync';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as path from "path";
import * as secretsmanger from "@aws-cdk/aws-secretsmanager"

export class ExampleStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'appsync-example-backend',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY
        }
      }
    })

    const vpc = new ec2.Vpc(this, 'ExampleVPC')

    const cluster = new rds.ServerlessCluster(this, 'AuroraExampleCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      defaultDatabaseName: 'Example',
      vpc,
      enableDataApi: true,
    })

    const secret = secretsmanger.Secret.fromSecretAttributes(this, 'Secret', {
      secretArn: cluster.secret?.secretArn || ''
    })

    const myFnc = new NodejsFunction(this, "my-function", {
      runtime: lambda.Runtime.NODEJS_14_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(20),
      handler: "main",
      entry: "src/lambda/index.ts",
      bundling: {
        minify: false,
        externalModules: ["aws-sdk"],
        nodeModules: ['@prisma/client', 'prisma'],
        commandHooks: {
          beforeBundling(_inputDir: string, _outputDir: string) {
            return []
          },
          beforeInstall(inputDir: string, outputDir: string) {
            return [`cp -R ${inputDir}/prisma ${outputDir}/`]
          },
          afterBundling(_inputDir: string, outputDir: string) {
            return [
              `cd ${outputDir}`,
              `npx prisma generate`,
              `rm -rf node_modules/@prisma/engines`,
            ]
          },
        },
      },
      environment: {
        SECRET_ID: cluster.secret?.secretArn || '',
        DATABASE_URL: process.env.DATABASE_URL || '',
        MASTER_SECRET: secret.toString(),
      },
    });

    const myFnc2 = new NodejsFunction(this, "my-func-test", {
      memorySize: 1024,
      timeout: cdk.Duration.seconds(20),
      handler: "test",
      entry: "src/lambda/test.ts",
      bundling: {
        minify: false,
        externalModules: ["aws-sdk"],
      }
    });

    cluster.grantDataApiAccess(myFnc)

    const lambdaDatasource = api.addLambdaDataSource('lambdaDatasource', myFnc)
    const lambdaDatasource2 = api.addLambdaDataSource('lambdaDatasource2', myFnc2)
    
    lambdaDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getUsers'
    })
    lambdaDatasource2.createResolver({
      typeName: 'Query',
      fieldName: 'test'
    })
  }
}
