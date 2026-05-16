/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { otpVerificationSchema } from "@/schemas/auth.schema";
import { Loader2, Shield } from "lucide-react";
import {
  useVerifyResetOtpMutation,
  useForgotPasswordMutation,
} from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";
import logo from "@/assets/logo.svg";
import { OtpVerificationValues } from "@/app/types/auth.type";
import { setCredentials } from "@/redux/features/auth/authSlice";

function VerifyResetOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const email = searchParams.get("email") || "";
  const [countdown, setCountdown] = useState(300);

  const [verifyResetOtp, { isLoading: isVerifying }] =
    useVerifyResetOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

  const form = useForm<OtpVerificationValues>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.push("/forgot-password");
      return;
    }

    // Countdown timer - decrements every second
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [email, router]);

  const onSubmit = async (data: OtpVerificationValues) => {
    if (countdown === 0) {
      toast.error("Verification code has expired. Please request a new code.");
      return;
    }

    try {
      const response = await verifyResetOtp({
        email,
        otp: data.otp,
      }).unwrap();

      if (response.success) {
        // Set temporary credentials in Redux for the reset password API call
        dispatch(
          setCredentials({
            user: {
              id: "",
              email: email,
              email_address: email,
              role: "",
              profile_image: null,
            },
            tokens: {
              access: response.data.access,
              refresh: response.data.refresh,
            },
          }),
        );
        toast.success("OTP verified successfully!");
        // Store email in sessionStorage for reset password page reference
        sessionStorage.setItem("reset_user_email", email);
        router.push("/reset-password");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Invalid verification code. Please try again.";
      toast.error(errorMessage);
      console.error("Verification error:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({
        email: email,
      }).unwrap();

      if (response.success) {
        // Reset countdown to 5 minutes
        setCountdown(300);

        toast.success("Verification code resent to your email!");
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to resend code. Please try again.";
      toast.error(errorMessage);
      console.error("Resend OTP error:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isExpired = countdown === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src={logo}
              alt="iNeed Logo"
              className="mx-auto w-32 h-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Verify Reset Code
            </h1>
            <p className="text-gray-600 text-sm">
              We&apos;ve sent a 6-digit verification code to
            </p>
            <p className="font-medium text-gray-900 mt-1">{email}</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000"
                        {...field}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timer */}
              <div className="text-center">
                {isExpired ? (
                  <p className="text-red-600 text-sm font-medium">
                    Code expired
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Code expires in{" "}
                    <span className="font-medium text-primary">
                      {formatTime(countdown)}
                    </span>
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying || isExpired}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          </Form>

          {/* Resend Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={isResending || !isExpired}
                className="text-primary hover:text-primary/80 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
            </p>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifyResetOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyResetOtpContent />
    </Suspense>
  );
}

export default VerifyResetOtpPage;
