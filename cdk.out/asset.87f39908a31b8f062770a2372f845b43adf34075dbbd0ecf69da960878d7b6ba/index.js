var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/node_modules/.prisma/client/index.js
var require_client = __commonJS({
  "asset-input/node_modules/.prisma/client/index.js"(exports, module2) {
    var PrismaClient2 = class {
      constructor() {
        throw new Error(`@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`);
      }
    };
    module2.exports = {
      PrismaClient: PrismaClient2
    };
  }
});

// asset-input/node_modules/@prisma/client/index.js
var require_client2 = __commonJS({
  "asset-input/node_modules/@prisma/client/index.js"(exports, module2) {
    var prisma = require_client();
    module2.exports = prisma;
  }
});

// asset-input/src/lambda/index.ts
var lambda_exports = {};
__export(lambda_exports, {
  main: () => main
});
module.exports = __toCommonJS(lambda_exports);
var import_client = __toESM(require_client2());
var import_aws_sdk = require("aws-sdk");
var sm = new import_aws_sdk.SecretsManager();
var db;
async function main(event) {
  const dbURL = await sm.getSecretValue({
    SecretId: process.env.SECRET_ID || ""
  }).promise();
  const secretString = JSON.parse(dbURL.SecretString || "{}");
  const url = `postgresql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`;
  db = new import_client.PrismaClient({
    datasources: { db: { url } }
  });
  const users = await db.user.findMany() || ["SAI"];
  return {
    body: JSON.stringify({ message: "Successful lambda invocation", users }),
    statusCode: 200
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
