export type ConnectionObject = {
    isConnected?: number 
}

export interface VerificationEmailProps {
    username: string;
    otp: string;
}