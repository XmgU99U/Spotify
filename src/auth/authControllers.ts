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

  //! check of one of inputs are not valid
  if (!isEmail(userEmail)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!isPassword(userPassword)) {
    return res.status(400).json({ error: "Invalid password" });
  }
  if (!isUserName(userName)) {
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

  //! hash the password before storing
  const hashedPass = await hash(userPassword, 10);

  //! everything is valid
  const result = await userModel.insertOne({
    userName,
    userEmail,
    userPassword,
    code,
  });
  const userId = result.id;
  console.log(userId);

  //! generate tokens
  const accessTokens = generateAccessToken({ userId });
  const refreshTokens = generateRefreshToken({ userId });

  //! send success response
  res.status(201).json({ accessTokens, refreshTokens });
};

const login = async (req: Request, res: Response) => {
  const { userEmail, userPassword } = req.body;

  //! check if one of inputs are undefined
  if (!userEmail || !userPassword) {
    return res.sendStatus(400);
  }

  //! check of one of inputs are not valid
  if (!isEmail(userEmail)) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (!isPassword(userPassword)) {
    return res.status(400).json({ error: "Invalid password" });
  }

  //! get user
  const findedUserEmail = await userModel.findOne(
    { $and: [{ isVerified: true }, { userEmail }] },
    { userPassword: 1 },
  );

  //! if no user found
  if (!findedUserEmail) {
    return res.status(400).json({ error: "Wrong user information" });
  }

  const userId = findedUserEmail.id;

  //! compare passwords
  const isMatch = await compare(userPassword, findedUserEmail.userPassword);

  //! if not matches
  if (!isMatch) {
    return res.status(400).json({ error: "Wrong user information" });
  }

  //! generate tokens
  const accessTokens = generateAccessToken({ userId });
  const refreshTokens = generateRefreshToken({ userId });

  //! send success responses
  res.status(200).json({ accessTokens, refreshTokens });
};
