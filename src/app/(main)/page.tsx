"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteAlertDialog from "@/components/Shared/DeleteAlertDialog";
import CategoriesPageSkeleton from "@/components/Skeleton/CategoriesPageSkeleton";
import {
  useAddCategoryImageMutation,
  useCreateCategoryMutation,
  useDeleteCategoryImageMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryImageMutation,
  useUpdateCategoryMutation,
} from "@/redux/features/categories/categoriesApi";
import type { CategoryImage, CategoryItem } from "@/app/types/category.type";
import { getErrorMessage } from "../lib/error";
import CreateCategoryModal from "@/components/Modals/CreateCategoryModal";
import EditProductModal, {
  type ProductFormValues,
} from "@/components/Modals/EditProductModal";
import ProductCard from "@/components/Cards/ProductCard";

const CategoriesPage = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [addCategoryImage, { isLoading: isAddingProduct }] =
    useAddCategoryImageMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();
  const [deleteCategoryImage, { isLoading: isDeletingImage }] =
    useDeleteCategoryImageMutation();
  const [updateCategoryImage, { isLoading: isUpdatingProduct }] =
    useUpdateCategoryImageMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(
    null,
  );
  const [editingProduct, setEditingProduct] = useState<CategoryImage | null>(
    null,
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const categories = useMemo(() => data?.data ?? [], [data]);

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return categories;
    }

    return categories.filter((category) =>
      category.category_type.toLowerCase().includes(term),
    );
  }, [categories, searchTerm]);

  const handleCreateCategory = async (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Category name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("category_type", trimmedName);

    try {
      await createCategory(formData).unwrap();
      toast.success("Category created successfully.");
      setIsCreateModalOpen(false);
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

  const openAddProductModal = (category: CategoryItem) => {
    setActiveCategory(category);
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (
    category: CategoryItem,
    product: CategoryImage,
  ) => {
    setActiveCategory(category);
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSubmitProduct = async (values: ProductFormValues) => {
    if (!activeCategory) {
      return;
    }

    const formData = new FormData();
    if (values.imageFile) {
      const imageKey = editingProduct ? "image" : "images";
      formData.append(imageKey, values.imageFile);
    }
    formData.append("brand_name", values.brandName);
    formData.append("dress_name", values.dressName);
    formData.append("web_url", values.webUrl);

    try {
      if (editingProduct) {
        await updateCategoryImage({
          imageId: editingProduct.id,
          data: formData,
        }).unwrap();
        toast.success("Product updated successfully.");
      } else {
        await addCategoryImage({
          categoryId: activeCategory.category_id,
          data: formData,
        }).unwrap();
        toast.success("Product added successfully.");
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setActiveCategory(null);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save product."));
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

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-full flex-1 items-center gap-2 md:max-w-md">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search category"
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            type="button"
            className="h-11 gap-1 rounded-lg px-5"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create category
          </Button>
        </div>
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
              Use the create button above to add your first category.
            </p>
          </div>
        )}
        {categories.length > 0 && filteredCategories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-amber-200 bg-white px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              No categories match your search.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different keyword.
            </p>
          </div>
        )}
        {filteredCategories.map((category) => {
          const isEditing = editingId === category.category_id;
          const productCount = category.images.length;

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
                    {productCount} product{productCount === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-9 gap-2"
                    onClick={() => openAddProductModal(category)}
                  >
                    <Plus className="h-4 w-4" />
                    Add product
                  </Button>
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

              {productCount === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-amber-200 bg-white px-6 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    No products added yet.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add your first product to show brand and web details.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {category.images.map((image) => (
                    <ProductCard
                      key={image.id}
                      product={image}
                      categoryName={category.category_type}
                      onEdit={() => openEditProductModal(category, image)}
                      onDelete={() => setDeleteImageId(image.id)}
                    />
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

      <CreateCategoryModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreate={async (name) => {
          await handleCreateCategory(name);
        }}
        isLoading={isCreating}
      />

      <EditProductModal
        open={isProductModalOpen}
        onOpenChange={(open) => {
          setIsProductModalOpen(open);
          if (!open) {
            setEditingProduct(null);
            setActiveCategory(null);
          }
        }}
        onSubmit={handleSubmitProduct}
        isLoading={isAddingProduct || isUpdatingProduct}
        mode={editingProduct ? "edit" : "add"}
        product={editingProduct}
        categoryName={activeCategory?.category_type}
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
        title="Delete product?"
        description="This will permanently remove the selected product."
      />
    </main>
  );
};

export default CategoriesPage;
