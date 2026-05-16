import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  saveTokenToStorage,
  saveUserToStorage,
  removeTokenFromStorage,
  removeUserFromStorage,
} from "@/lib/auth-storage";
import { RootState } from "@/redux/store";
import { User } from "@/app/types/auth.type";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: { access: string; refresh: string };
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.tokens.access;
      state.refreshToken = action.payload.tokens.refresh;

      // Persist to localStorage and cookies
      saveTokenToStorage(
        action.payload.tokens.access,
        action.payload.tokens.refresh,
      );
      saveUserToStorage(action.payload.user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      // Clear from localStorage and cookies
      removeTokenFromStorage();
      removeUserFromStorage();
    },
    hydrate: (
      state,
      action: PayloadAction<{
        user: User | null;
        token: string | null;
        refreshToken: string | null;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return;

      const nextUser = { ...state.user, ...action.payload };
      const firstName = action.payload.first_name ?? nextUser.first_name;
      const lastName = action.payload.last_name ?? nextUser.last_name;
      const combinedName = `${firstName ?? ""} ${lastName ?? ""}`.trim();

      if (combinedName) {
        nextUser.full_name = combinedName;
      }

      state.user = nextUser;
      saveUserToStorage(state.user);
    },
  },
});

export const { setCredentials, logout, hydrate, updateUser } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
