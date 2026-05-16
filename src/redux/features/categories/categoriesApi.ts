import {
  CategoriesResponse,
  CategoryResponse,
  CategoryImageResponse,
  CategoryDeleteResponse,
} from "@/app/types/category.type";
import { baseApi } from "../../api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/admin/categories/",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategory: builder.query<CategoryResponse, number>({
      query: (id) => ({
        url: `/admin/categories/${id}/`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: "/admin/categories/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: number; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<CategoryDeleteResponse, number>({
      query: (id) => ({
        url: `/admin/categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategoryImage: builder.mutation<CategoryImageResponse, number>({
      query: (imageId) => ({
        url: `/admin/categories/images/${imageId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategoryImage: builder.mutation<
      CategoryImageResponse,
      { imageId: number; data: FormData }
    >({
      query: ({ imageId, data }) => ({
        url: `/admin/categories/images/${imageId}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useDeleteCategoryImageMutation,
  useUpdateCategoryImageMutation,
} = categoriesApi;
