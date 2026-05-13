"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class RedisClient {
    constructor() {
        this.client = (0, redis_1.createClient)();
        this.client.on("error", (error) => {
            console.log(`REDIS ERROR: ${error}`);
        });
        this.client.on("connect", () => {
            console.log("CONNECTED TO REDIS SERVER");
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.connect());
            }
            catch (e) {
                console.log(`REDIS CATCHED ERROR: ${e}`);
            }
        });
    }
}
RedisClient.redisClient = new RedisClient();
exports.default = RedisClient.redisClient;
