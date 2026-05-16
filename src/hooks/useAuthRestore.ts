"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useGetAdminProfileQuery } from "@/redux/features/auth/authApi";

/**
 * Hook to restore authentication state from localStorage on app initialization
 * This solves the issue of Redux store being reset on page refresh
 */
export function useAuthRestore() {
  const dispatch = useAppDispatch();
  const [isRestoring, setIsRestoring] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Once credentials are restored from localStorage, call admin profile
  // to get fresh user info (profile_image, name, etc.) and keep Redux in sync.
  useGetAdminProfileQuery(undefined, { skip: !hasToken });

  useEffect(() => {
    const restoreAuth = () => {
      try {
        // Check if we're in the browser
        if (typeof window === "undefined") {
          setIsRestoring(false);
          return;
        }

        // Get stored auth data from localStorage
        const storedUser = localStorage.getItem("user");
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");

        // If we have all required data, restore the auth state
        if (storedUser && storedAccessToken && storedRefreshToken) {
          const user = JSON.parse(storedUser);

          dispatch(
            setCredentials({
              user,
              tokens: {
                access: storedAccessToken,
                refresh: storedRefreshToken,
              },
            }),
          );

          // Trigger /auth/me/ to fetch fresh user data from the server
          setHasToken(true);
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        // Clear corrupted data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setIsRestoring(false);
      }
    };

    restoreAuth();
  }, [dispatch]);

  return { isRestoring };
}
