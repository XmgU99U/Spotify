import userModel from "./userModel";
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./token_generators";
import { isEmail, isPassword, isUserName, isCode } from "./validators";

const register = async (req: Request, res: Response) => {
  const { userName, userEmail, userPassword } = req.body;

  
  //! get random number
  const code: number = Math.floor(
    Math.random() * (999999 - 100000 + 1) + 100000,
  );
  
  //! check if one of inputs are undefined
  if (!userName || !userEmail || !userPassword) {
    return res.sendStatus(400);
  }
  
  //! check of one of those inputs are not valid
  if (!isEmail) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!isPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }
  if (!isUserName) {
    return res.status(400).json({ error: "Invalid username" });
  }
  
  //! find a user who has same email
  const foundedUserWithSameEmail = await userModel
  .findOne({ userEmail })
  .exec();
  if (foundedUserWithSameEmail) {
    return res.status(400).json({ error: "User already exist" });
  }
  
  //! find user who has same username
  const foundedUserWithSameUserName = await userModel
  .findOne({ userName })
    .exec();
    if (foundedUserWithSameUserName) {
      return res.status(400).json({ error: "This username already exist" });
    }

  //! hash the password before storing it 
  const hashedPass = await hash(userPassword , 10);
    
  //! if everything is valid store the data inside database
  const user = new userModel({
    userName,
    userEmail,
    hashedPass,
    code,
  });
  await user.save();
};
