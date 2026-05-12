"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const generateAccessToken = (data) => {
    return (0, jsonwebtoken_1.sign)(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (data) => {
    return (0, jsonwebtoken_1.sign)(data, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
