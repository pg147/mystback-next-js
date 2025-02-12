// Resend dependency
import { resend } from "@/lib/resend";

// Email template
import VerificationEmail from "../../emails/VerificationEmail";

// Types
import { ApiResponse } from "@/types/apiResponse.types";

export async function sendVerificationEmails(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Msytback | Verification code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });

    if (error) return { success: false, message: error.message };

    return { success: true, message: "Verification email sent successfully!" };
  } catch (emailError) {
    console.error("Error sending verification email: ", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
