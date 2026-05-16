"use client";

import { makeStore } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { getTokenFromStorage, getUserFromStorage } from "@/lib/auth-storage";
import { hydrate } from "@/redux/features/auth/authSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the store instance only once using lazy initialization
  const [store] = useState(() => makeStore());
  const initialized = useRef(false);

  useEffect(() => {
    // Hydrate auth state from localStorage on mount
    if (!initialized.current) {
      initialized.current = true;
      const { token, refreshToken } = getTokenFromStorage();
      const user = getUserFromStorage();

      if (token && user) {
        store.dispatch(hydrate({ user, token, refreshToken }));
      }
    }
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
