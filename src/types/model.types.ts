import { Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
};

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    message: Message[];
};
