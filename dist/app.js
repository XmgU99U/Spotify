"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
dotenv_1.default.config();
(0, mongoose_1.connect)(process.env.MONGO_DB_URL).then((_data) => console.log("Connected to DB"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
//!  MY MIDDLE WARES
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, express_fileupload_1.default)());
app.use('/auth', authRoutes_1.default);
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT PORT`);
});
