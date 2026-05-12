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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCode = exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("./userModel"));
const bcrypt_1 = require("bcrypt");
const token_generators_1 = require("./token_generators");
const validators_1 = require("./validators");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, userEmail, userPassword } = req.body;
    //! get random number
    const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    //! check if one of inputs are undefined
    if (!userName || !userEmail || !userPassword) {
        return res.sendStatus(400);
    }
    //! check of one of inputs are not valid
    if (!(0, validators_1.isEmail)(userEmail)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    if (!(0, validators_1.isPassword)(userPassword)) {
        return res.status(400).json({ error: "Invalid password" });
    }
    if (!(0, validators_1.isUserName)(userName)) {
        return res.status(400).json({ error: "Invalid username" });
    }
    //! find a user who has same email
    const foundedUserWithSameEmail = yield userModel_1.default
        .findOne({ userEmail })
        .exec();
    if (foundedUserWithSameEmail) {
        return res.status(403).json({ error: "User already exist" });
    }
    //! find user who has same username
    const foundedUserWithSameUserName = yield userModel_1.default
        .findOne({ userName })
        .exec();
    if (foundedUserWithSameUserName) {
        return res.status(403).json({ error: "This username already exist" });
    }
    //! hash the password before storing
    const hashedPass = yield (0, bcrypt_1.hash)(userPassword, 10);
    //! everything is valid
    const result = yield userModel_1.default.insertOne({
        userName,
        userEmail,
        userPassword: hashedPass,
        code,
    });
    const userId = result.id;
    console.log(userId);
    //! generate tokens
    const accessTokens = (0, token_generators_1.generateAccessToken)({ userId, isVerified: false });
    const refreshTokens = (0, token_generators_1.generateRefreshToken)({ userId, isVerified: false });
    //! send success response
    res.status(201).json({ accessTokens, refreshTokens });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail, userPassword } = req.body;
    //! check if one of inputs are undefined
    if (!userEmail || !userPassword) {
        return res.sendStatus(400);
    }
    //! check of one of inputs are not valid
    if (!(0, validators_1.isEmail)(userEmail)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    if (!(0, validators_1.isPassword)(userPassword)) {
        return res.status(400).json({ error: "Invalid password" });
    }
    //! get user
    const findedUserEmail = yield userModel_1.default
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
    const isMatch = yield (0, bcrypt_1.compare)(userPassword, findedUserEmail.userPassword);
    //! if not matches
    if (!isMatch) {
        return res.status(400).json({ error: "Wrong user information" });
    }
    //! generate tokens
    const accessTokens = (0, token_generators_1.generateAccessToken)({ userId, isVerified });
    const refreshTokens = (0, token_generators_1.generateRefreshToken)({ userId, isVerified });
    //! send success responses
    res.status(200).json({ accessTokens, refreshTokens });
});
exports.login = login;
const checkCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.userId;
    console.log(userId);
    const isVerified = res.locals.isVerified;
    const code = req.body.code;
    if (!(0, validators_1.isCode)(code)) {
        return res.sendStatus(400);
    }
    if (isVerified) {
        return res.sendStatus(403);
    }
    const user = yield userModel_1.default.findById(userId, { code: 1 }).exec();
    if (!user) {
        return res.sendStatus(404);
    }
    if (!(user.code === code)) {
        return res.status(400).json({ error: "Wrong code" });
    }
    yield userModel_1.default.findByIdAndUpdate(userId, { isVerified: true }).exec();
    const accessTokens = (0, token_generators_1.generateAccessToken)({ userId, isVerified: true });
    const refreshTokens = (0, token_generators_1.generateRefreshToken)({ userId, isVerified: true });
    res.status(200).json({ accessTokens, refreshTokens });
});
exports.checkCode = checkCode;
