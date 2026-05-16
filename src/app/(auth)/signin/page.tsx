/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { loginformSchema } from "@/schemas/auth.schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";
import { LoginFormValues } from "@/app/types/auth.type";
import { setCredentials } from "@/redux/features/auth/authSlice";
import Image from "next/image";
import logo from "@/assets/logo.svg";

function SigninPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      const adminUser = response.data.user;

      dispatch(
        setCredentials({
          user: {
            id: String(adminUser.id),
            username: adminUser.username,
            email: adminUser.email,
            first_name: adminUser.first_name,
            last_name: adminUser.last_name,
            full_name: `${adminUser.first_name} ${adminUser.last_name}`.trim(),
            role: "admin",
            profile_image: adminUser.profile_image,
          },
          tokens: {
            access: response.data.access,
            refresh: response.data.refresh,
          },
        }),
      );
      toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to login. Please try again.";
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src={logo} alt="iNeed Logo" className="mx-auto w-32 h-auto" />
        </div>
        <div className="w-full max-w-md border rounded-lg p-6 bg-white shadow">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Login
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Please enter your credentials to access your
              account.
            </p>
          </div>

          {/* Sign In Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-gray-700">Password</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="text-right">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-yellow-600 hover:text-yellow-700"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SigninPage;
