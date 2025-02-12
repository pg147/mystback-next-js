import mongoose, { Schema, model } from "mongoose";
import { Message, User } from "@/types/model.types";

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  message: [MessageSchema],
});

// Checking if User Model already exists
const UserModel = mongoose.models.User as mongoose.Model<User> || model<User>("User", UserSchema);

export default UserModel;
