import {
  loginformSchema,
  otpVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/schemas/auth.schema";
import * as z from "zod";

export type TUserRole = "user" | "provider";
export type LoginFormValues = z.infer<typeof loginformSchema>;
export type OtpVerificationValues = z.infer<typeof otpVerificationSchema>;

// API Request Types
export interface SignupRequest {
  full_name: string;
  email_address: string;
  user_role: "user" | "provider";
  password: string;
  confirm_password: string;
}

export interface VerifyEmailRequest {
  email_address: string;
  otp_code: string;
}

export interface ResendOtpRequest {
  email_address: string;
}

// API Response Types
export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    email_address: string;
    user_role: string;
    otp_expires_at: string;
  };
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      full_name: string;
      email_address: string;
      role: string;
    };
    tokens: {
      access: string;
      refresh: string;
    };
  };
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    email_address: string;
    otp_expires_at: string;
  };
}

// Login Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    refresh: string;
    access: string;
    user: {
      id: number;
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      is_staff: boolean;
      is_superuser: boolean;
      profile_image: string | null;
    };
  };
}

// Forgot Password Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

// Verify Reset OTP Types
export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    access: string;
    refresh: string;
  };
}

// Reset Password Types
export interface ResetPasswordRequest {
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// Change Password Types
export interface ChangePasswordRequest {
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

// Admin User Type
export interface User {
  id: string | number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email_address?: string;
  role: string;
  profile_image: string | null;
}

// Update Profile Types
export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: File;
}

export interface UpdateProfileResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}
