import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { getTokenFromStorage } from "@/lib/auth-storage";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/api",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // Try to get token from Redux state first
    let token = (getState() as RootState).auth.token;

    // If token is not in Redux state, try to get it from localStorage as fallback
    if (!token && typeof window !== "undefined") {
      const { token: storedToken } = getTokenFromStorage();
      token = storedToken;
    }

    if (token) {
      const headerValue = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      headers.set("authorization", headerValue);
    }
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "Category"],
});
