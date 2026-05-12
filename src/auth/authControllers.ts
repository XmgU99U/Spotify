import userModel from "./userModel";
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./token_generators";

const register = (req: Request, res: Response) => {
  const { userName, userEmail, userPassword } = req.body;
  const code : number = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
  if(!userName || !userEmail || !userPassword) {
    return res.sendStatus(400)
  }

};
