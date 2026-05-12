import { Schema, model } from "mongoose";

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPassword: {
    type: String,
    required: true,
  },
  userProfileImage: {
    type: String,
    default: "default.jpg",
  },
  code: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});


export default model('users' , userSchema) ; 