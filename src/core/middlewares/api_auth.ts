import { NextFunction, Request, Response } from "express";
import {
  JsonWebTokenError,
  JwtPayload,
  NotBeforeError,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";

class ApiAuth {
  static apiAuth: ApiAuth = new ApiAuth();
  bearerToken(req: Request, res: Response, next: NextFunction) {
    const bearer = req.headers["authorization"];

    if (!bearer || !bearer.startsWith("Bearer")) {
      return res.sendStatus(400);
    }

    const accessToken = bearer!.split(" ")[1];

    try {
      const payload = verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      res.locals.userId = (payload as JwtPayload).userId;
      res.locals.isVerified = (payload as JwtPayload).isVerified;
      next();
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        return res.status(403).json({ error: e.message });
      }
      if (e instanceof JsonWebTokenError) {
        return res.status(401).json({ error: e.message });
      }
      if (e instanceof NotBeforeError) {
        return res.status(401).json({ error: e.message });
      }
    }
  }

  basicAuth(req: Request, res: Response, next: Function) {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf-8",
    );
    const [username, password] = credentials.split(":");

    if (
      username === process.env.BASIC_AUTH_USERNAME &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      return next();
    }

    return res.status(401).json({ message: "Invalid credentials" });
  }
}

export default ApiAuth.apiAuth;
