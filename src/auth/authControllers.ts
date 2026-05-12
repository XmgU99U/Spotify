import userModel from "./userModel";
import { hash, compare } from "bcrypt";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "./token_generators";
import { isEmail, isPassword, isUserName, isCode } from "./validators";
import { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError, verify } from "jsonwebtoken";

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
    return res.status(403).json({ error: "User already exist" });
  }

  //! find user who has same username
  const foundedUserWithSameUserName = await userModel
    .findOne({ userName })
    .exec();
  if (foundedUserWithSameUserName) {
    return res.status(403).json({ error: "This username already exist" });
  }

  //! hash the password before storing
  const hashedPass = await hash(userPassword, 10);

  //! everything is valid
  const result = await userModel.insertOne({
    userName,
    userEmail,
    userPassword: hashedPass,
    code,
  });
  const userId = result.id;
  console.log(userId);

  //! generate tokens
  const accessTokens = generateAccessToken({ userId, isVerified: false });
  const refreshTokens = generateRefreshToken({ userId, isVerified: false });

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
  const findedUserEmail = await userModel
    .findOne({ userEmail }, { userPassword: 1, isVerified: 1 })
    .exec();

  //! if no user found
  if (!findedUserEmail) {
    return res.status(400).json({ error: "Wrong user information" });
  }

  //! if user verified
  const isVerified = findedUserEmail.isVerified;
  if (!isVerified) {
    return res.status(403).json({ error: "Not verified" });
  }

  const userId = findedUserEmail.id;

  //! compare passwords
  const isMatch = await compare(userPassword, findedUserEmail.userPassword);

  //! if not matches
  if (!isMatch) {
    return res.status(400).json({ error: "Wrong user information" });
  }

  //! generate tokens
  const accessTokens = generateAccessToken({ userId, isVerified });
  const refreshTokens = generateRefreshToken({ userId, isVerified });

  //! send success responses
  res.status(200).json({ accessTokens, refreshTokens });
};

const checkCode = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  console.log(userId);
  const isVerified = res.locals.isVerified;
  const code = req.body.code;
  if (!isCode(code)) {
    return res.sendStatus(400);
  }

  if (isVerified) {
    return res.sendStatus(403);
  }
  const user = await userModel.findById(userId, { code: 1 }).exec();

  if (!user) {
    return res.sendStatus(404);
  }

  if (!(user.code === code)) {
    return res.status(400).json({ error: "Wrong code" });
  }

  await userModel.findByIdAndUpdate(userId, { isVerified: true }).exec();

  const accessTokens = generateAccessToken({ userId, isVerified: true });
  const refreshTokens = generateRefreshToken({ userId, isVerified: true });

  res.status(200).json({ accessTokens, refreshTokens });
};

const refreshAccessToken = (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken || typeof refreshToken !== "string") {
    return res.sendStatus(400);
  }
  try {
    const payload = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as JwtPayload;
    const accessToken = generateAccessToken({
      userId: payload.userId,
      isVerified: payload.isVerified,
    });
    res.status(200).json({accessToken}) ;
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
};

export { register, login, checkCode , refreshAccessToken};
