import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connect } from "mongoose";
connect("mongodb://localhost:27017/Spotify").then((_data) =>console.log("Connected to DB"));

const app = express();
const PORT = process.env.PORT || 3000;

//!  MY MIDDLE WARES
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT PORT`);
});
