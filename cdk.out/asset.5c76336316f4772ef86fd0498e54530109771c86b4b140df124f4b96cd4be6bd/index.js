var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// asset-input/src/lambda/index.ts
var lambda_exports = {};
__export(lambda_exports, {
  main: () => main
});
module.exports = __toCommonJS(lambda_exports);
var import_aws_sdk = require("aws-sdk");
var sm = new import_aws_sdk.SecretsManager();
async function main(event) {
  const dbURL = await sm.getSecretValue({
    SecretId: process.env.SECRET_ID || ""
  }).promise();
  const secretString = JSON.parse(dbURL.SecretString || "{}");
  const url = `mysql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`;
  return {
    body: [url],
    statusCode: 200
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  main
});
