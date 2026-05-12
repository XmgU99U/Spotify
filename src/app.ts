import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;



//!  MY MIDDLE WARES 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());





app.listen(PORT, () => {
console.log(`SERVER IS RUNNING ON PORT PORT`);
});
