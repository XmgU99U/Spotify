import express from "express";
import { register , login , checkCode , refreshAccessToken} from "./authControllers";
import apiAuth from "../core/middlewares/api_auth";
const router = express.Router();

router.post('/login', login) 

router.post('/register' , register)

router.post('/checkCode' , apiAuth.bearerToken , checkCode) ;

router.post('/refreshToken' , apiAuth.basicAuth , refreshAccessToken)


export default router;
