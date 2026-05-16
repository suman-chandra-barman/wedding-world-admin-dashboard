"use client";

import { useAuthRestore } from "@/hooks/useAuthRestore";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that restores authentication state on app initialization
 * Place this component inside the StoreProvider in your layout
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isRestoring } = useAuthRestore();

  // Optionally show a loading state while restoring auth
  // You can remove this if you don't want any delay
  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
