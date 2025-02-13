// Dependencies
import bcrypt from "bcryptjs";

// Utilities
import dbConnect from "@/lib/dbConnect";

// Helpers
import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";

// Models
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Checking if user exist and is already verified
    const verifiedUserExists = await UserModel.findOne({
      username,
      isVerified: true,
    });

    // If verified user exist return
    if (verifiedUserExists) {
      return Response.json(
        {
          success: false,
          message: "User already exists!",
        },
        { status: 400 }
      );
    }

    // Finding user by email
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generating OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    // If user exists
    if (existingUserByEmail) {
      // If user exists and is verified 
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Username already exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10); // hashing the password
        existingUserByEmail.password = hashedPassword;  // updating password
        existingUserByEmail.verifyCode = OTP;  // updating otp
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);  // setting expiry for the OTP
        
        // saving/updating the user in database
        await existingUserByEmail.save();  
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10); // hashing the password
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // setting expiry date for OTP

      // Creating new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessage: true,
        verifyCode: OTP,
        verifyCodeExpiry: expiryDate,
        message: [],
      });

      // Saving user to database
      await newUser.save();
    }

    // Sending verification email
    const emailResponse = await sendVerificationEmails(username, email, OTP);

    // If email verification link fails
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // If email verification sent successfully
    return Response.json(
      {
        success: true,
        message: "User verified successfully. Please verify your email",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error registering user: ", error?.message);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
