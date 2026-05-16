"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { ImageIcon, Pencil, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import DeleteAlertDialog from "@/components/Shared/DeleteAlertDialog";
import CategoriesPageSkeleton from "@/components/Skeleton/CategoriesPageSkeleton";
import {
  useCreateCategoryMutation,
  useDeleteCategoryImageMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryImageMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import type { CategoryItem } from "@/app/types/category.type";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) {
      return data.message;
    }
  }

  return fallback;
};

const CategoriesPage = () => {
  const { data, isLoading, isFetching } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();
  const [deleteCategoryImage, { isLoading: isDeletingImage }] =
    useDeleteCategoryImageMutation();
  const [updateCategoryImage] = useUpdateCategoryImageMutation();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryFiles, setNewCategoryFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

  const newCategoryPreviews = useMemo(() => {
    if (newCategoryFiles.length === 0) {
      return [] as string[];
    }

    return newCategoryFiles.map((file) => URL.createObjectURL(file));
  }, [newCategoryFiles]);

  useEffect(() => {
    return () => {
      newCategoryPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newCategoryPreviews]);

  const categories = data?.data ?? [];

  const handleCreateCategory = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("category_type", trimmedName);

    if (newCategoryFiles.length) {
      newCategoryFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully.");
      setNewCategoryName("");
      setNewCategoryFiles([]);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create category."));
    }
  };

  const handleStartEdit = (category: CategoryItem) => {
    setEditingId(category.category_id);
    setEditingName(category.category_type);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (category: CategoryItem) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("category_type", trimmedName);

    try {
      await updateCategory({
        id: category.category_id,
        data: formData,
      }).unwrap();
      toast.success("Category updated successfully.");
      handleCancelEdit();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update category."));
    }
  };

  const handleAddImages = async (
    category: CategoryItem,
    files: FileList | null,
  ) => {
    if (!files?.length) {
      return;
    }

    const formData = new FormData();
    formData.append("category_type", category.category_type);
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      await updateCategory({
        id: category.category_id,
        data: formData,
      }).unwrap();
      toast.success("Images uploaded successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to upload images."));
    }
  };

  const handleReplaceImage = async (imageId: number, file?: File | null) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await updateCategoryImage({ imageId, data: formData }).unwrap();
      toast.success("Image updated successfully.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update image."));
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryId) {
      return;
    }

    try {
      const response = await deleteCategory(deleteCategoryId).unwrap();
      toast.success(response.message || "Category deleted successfully.");
      setDeleteCategoryId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete category."));
    }
  };

  const handleDeleteImage = async () => {
    if (!deleteImageId) {
      return;
    }

    try {
      await deleteCategoryImage(deleteImageId).unwrap();
      toast.success("Image deleted successfully.");
      setDeleteImageId(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete image."));
    }
  };

  if (isLoading) {
    return (
      <main className="h-full">
        <CategoriesPageSkeleton />
      </main>
    );
  }

  return (
    <main className="h-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Category Studio
        </h1>
        <p className="text-sm text-muted-foreground">
          Curate, upload, and manage your bridalwear categories with clarity and
          speed.
        </p>
      </div>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Create a new category
            </h2>
            <p className="text-sm text-muted-foreground">
              Add a name and optional images to publish instantly.
            </p>
          </div>
          {isFetching && (
            <span className="text-xs text-muted-foreground">Refreshing...</span>
          )}
        </div>

        <form
          onSubmit={handleCreateCategory}
          className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <Input
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
            placeholder="Category name"
            className="h-11 max-w-sm"
          />
          <label className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 hover:bg-amber-100">
            <UploadCloud className="h-4 w-4" />
            <span>Select images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                if (files.length) {
                  setNewCategoryFiles((prev) => [...prev, ...files]);
                }
                event.target.value = "";
              }}
            />
          </label>
          <Button
            type="submit"
            className="h-11 gap-2 rounded-lg px-5"
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            {isCreating ? "Creating..." : "Create category"}
          </Button>
        </form>

        {newCategoryPreviews.length > 0 && (
          <div className="mt-5 rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Selected images ({newCategoryPreviews.length})
              </p>
              <p className="text-xs text-muted-foreground">
                These will upload with the category.
              </p>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {newCategoryPreviews.map((preview, index) => (
                <div
                  key={`${preview}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-amber-100 bg-white"
                >
                  <div className="relative h-20 w-full bg-amber-50/30">
                    <Image
                      src={preview}
                      alt={`Selected preview ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-contain p-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setNewCategoryFiles((prev) =>
                        prev.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-foreground opacity-0 shadow-sm transition group-hover:opacity-100"
                    aria-label="Remove selected image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-6">
        {categories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-amber-200 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <ImageIcon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              No categories created yet.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Use the form above to add your first category.
            </p>
          </div>
        )}
        {categories.map((category) => {
          const isEditing = editingId === category.category_id;
          const imageCount = category.images.length;

          return (
            <div
              key={category.category_id}
              className="rounded-3xl border border-border bg-[#fdfaf6] p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        className="h-10 max-w-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-9"
                        onClick={() => handleSaveEdit(category)}
                        disabled={isUpdatingCategory}
                      >
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-9"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {category.category_type}
                      </h3>
                      <button
                        type="button"
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-white hover:text-foreground"
                        onClick={() => handleStartEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {imageCount} image{imageCount === 1 ? "" : "s"} uploaded
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-lg border border-dashed border-amber-200 bg-white px-3 py-2 text-xs text-amber-700 hover:bg-amber-50">
                    <UploadCloud className="h-4 w-4" />
                    Add images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        handleAddImages(category, event.target.files)
                      }
                    />
                  </label>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-9"
                    onClick={() => setDeleteCategoryId(category.category_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {imageCount === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-amber-200 bg-white px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    No images added yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Start by uploading your first style shot.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {category.images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-white"
                    >
                      <div className="relative h-52 w-full bg-amber-50/40">
                        <Image
                          src={image.image_url}
                          alt={category.category_type}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 via-black/20 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                        <label className="flex items-center gap-2 rounded-lg bg-white/90 px-2 py-1 text-xs text-foreground">
                          <UploadCloud className="h-3 w-3" />
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleReplaceImage(
                                image.id,
                                event.target.files?.[0],
                              )
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-lg bg-red-500/90 px-2 py-1 text-xs text-white"
                          onClick={() => setDeleteImageId(image.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <DeleteAlertDialog
        open={deleteCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCategoryId(null);
          }
        }}
        onConfirm={handleDeleteCategory}
        isLoading={isDeletingCategory}
        title="Delete category?"
        description="This will remove the category and all its images."
      />

      <DeleteAlertDialog
        open={deleteImageId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteImageId(null);
          }
        }}
        onConfirm={handleDeleteImage}
        isLoading={isDeletingImage}
        title="Delete image?"
        description="This will permanently remove the selected image."
      />
    </main>
  );
};

export default CategoriesPage;
