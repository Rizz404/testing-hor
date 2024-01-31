"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const __1 = __importDefault(require("../.."));
const serverless_http_1 = __importDefault(require("serverless-http"));
// * Intinya biar serverless lah
exports.handler = (0, serverless_http_1.default)(__1.default);
//# sourceMappingURL=api.js.map