// Utility functions for managing auth tokens in localStorage and cookies

import { User } from "@/app/types/auth.type";

export const saveTokenToStorage = (token: string, refreshToken: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("refresh_token", refreshToken);

    // Also set as cookie for middleware access
    document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
  }
};

export const getTokenFromStorage = (): {
  token: string | null;
  refreshToken: string | null;
} => {
  if (typeof window !== "undefined") {
    return {
      token: localStorage.getItem("auth_token"),
      refreshToken: localStorage.getItem("refresh_token"),
    };
  }
  return { token: null, refreshToken: null };
};

export const removeTokenFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");

    // Remove cookies
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "auth_role=; path=/; max-age=0";
  }
};

export const getUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("auth_user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

export const saveUserToStorage = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_user", JSON.stringify(user));

    // Also store role in cookie so middleware can enforce admin-only routes.
    document.cookie = `auth_role=${encodeURIComponent(user.role)}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
};

export const removeUserFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_user");
  }
};
