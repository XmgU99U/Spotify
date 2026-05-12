"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class ApiAuth {
    bearerToken(req, res, next) {
        const bearer = req.headers["authorization"];
        if (!bearer || !bearer.startsWith('Bearer')) {
            return res.sendStatus(400);
        }
        const accessToken = bearer.split(" ")[1];
        try {
            const payload = (0, jsonwebtoken_1.verify)(accessToken, process.env.ACCESS_TOKEN_SECRET);
            res.locals.userID = payload.userId;
            res.locals.isVerified = payload.isVerified;
            next();
        }
        catch (e) {
            return this.handleVerifyTokenError(e, res);
        }
    }
    handleVerifyTokenError(e, res) {
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            return res.status(401).json({ error: e.message });
        }
        if (e instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(403).json({ error: e.message });
        }
        if (e instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(401).json({ error: e.message });
        }
    }
    basicAuth(req, res, next) {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
        const [username, password] = credentials.split(":");
        if (username === process.env.BASIC_AUTH_USERNAME && password === process.env.BASIC_AUTH_PASSWORD) {
            return next();
        }
        return res.status(401).json({ message: "Invalid credentials" });
    }
}
ApiAuth.apiAuth = new ApiAuth();
exports.default = ApiAuth.apiAuth;
