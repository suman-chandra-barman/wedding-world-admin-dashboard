import {
  VerifyEmailRequest,
  VerifyEmailResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "@/app/types/auth.type";
import { baseApi } from "../../api/baseApi";
import { updateUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/auth/verify-email/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/admin/login/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/admin/forgot-password/",
        method: "POST",
        body: data,
      }),
    }),
    verifyResetOtp: builder.mutation<
      VerifyResetOtpResponse,
      VerifyResetOtpRequest
    >({
      query: (data) => ({
        url: "/admin/verify-otp/",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/admin/reset-password/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getAdminProfile: builder.query<
      {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        profile_image: string | null;
      },
      void
    >({
      query: () => ({
        url: "/api/admin/admin/profile/",
        method: "GET",
      }),
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            updateUser({
              id: data.id,
              username: data.username,
              email: data.email,
              first_name: data.first_name,
              last_name: data.last_name,
              profile_image: data.profile_image,
            }),
          );
        } catch {
          // silently ignore
        }
      },
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: "/admin/admin/profile/",
        method: "PATCH",
        body: formData,
      }),
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const responseData =
            typeof data === "object" && data !== null && "data" in data
              ? (data as { data: UpdateProfileResponse }).data
              : data;
          const currentUser = (getState() as import("@/redux/store").RootState)
            .auth.user;
          const payload: Partial<import("@/app/types/auth.type").User> = {};

          if (responseData.id !== undefined) payload.id = responseData.id;
          if (responseData.username !== undefined)
            payload.username = responseData.username;
          if (responseData.email !== undefined)
            payload.email = responseData.email;
          if (responseData.first_name !== undefined)
            payload.first_name = responseData.first_name;
          if (responseData.last_name !== undefined)
            payload.last_name = responseData.last_name;
          if (responseData.profile_image !== undefined)
            payload.profile_image = responseData.profile_image;

          if (!currentUser && Object.keys(payload).length === 0) return;
          dispatch(updateUser(payload));
        } catch {
          // silently ignore
        }
      },
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/admin/reset-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useVerifyEmailMutation,
  useGetAdminProfileQuery,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
