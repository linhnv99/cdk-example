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

// asset-input/src/lambda/user.ts
var user_exports = {};
__export(user_exports, {
  userHandler: () => userHandler
});
module.exports = __toCommonJS(user_exports);
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
var userHandler = async () => {
  let users = await prisma.user.findMany();
  return {
    statusCode: 200,
    body: JSON.stringify({ users }),
    headers: {
      "Content-Type": "application/json"
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  userHandler
});
