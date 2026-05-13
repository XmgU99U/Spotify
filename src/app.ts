import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connect } from "mongoose";
import dotenv from "dotenv";
import authRoutes from './auth/authRoutes' ;
import redisClient from "./core/redisClient"; 


dotenv.config();
connect(process.env.MONGO_DB_URL as string ).then((_data) =>
  console.log("Connected to DB"),
);
redisClient.connect()

const app = express();
const PORT = process.env.PORT || 3000;

//!  MY MIDDLE WARES
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use('/auth' , authRoutes)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT PORT`);
});
