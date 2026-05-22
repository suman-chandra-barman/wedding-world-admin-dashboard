"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { UploadCloud } from "lucide-react";
import type { CategoryImage } from "@/app/types/category.type";

export interface ProductFormValues {
  imageFile: File | null;
  brandName: string;
  dressName: string;
  webUrl: string;
}

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  isLoading?: boolean;
  mode?: "add" | "edit";
  product?: CategoryImage | null;
  categoryName?: string;
}

export default function EditProductModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  mode = "add",
  product,
  categoryName,
}: EditProductModalProps) {
  const isEdit = mode === "edit";
  const [brandName, setBrandName] = useState("");
  const [dressName, setDressName] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setBrandName("");
      setDressName("");
      setWebUrl("");
      setImageFile(null);
      setPreviewUrl("");
      setError("");
      return;
    }

    if (product) {
      setBrandName(product.brand_name ?? "");
      setDressName(product.dress_name ?? "");
      setWebUrl(product.web_url ?? "");
      setPreviewUrl(product.image_url ?? "");
    } else {
      setBrandName("");
      setDressName("");
      setWebUrl("");
      setPreviewUrl("");
    }

    setImageFile(null);
    setError("");
  }, [open, product]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!isEdit && !imageFile) {
      setError("Product image is required.");
      return;
    }

    setError("");
    await onSubmit({
      imageFile,
      brandName: brandName.trim(),
      dressName: dressName.trim(),
      webUrl: webUrl.trim(),
    });
  };

  const title = isEdit ? "Edit Product" : "Add Product";
  const subtitle = isEdit
    ? "Update product details for this category."
    : "Upload a product image and add brand details.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            {title}
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground pt-1">
            {categoryName ? `${categoryName} · ${subtitle}` : subtitle}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Product image
                </p>
                <p className="text-xs text-muted-foreground">
                  {isEdit
                    ? "Replace image if you want to update it."
                    : "Upload a clean product shot."}
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50">
                <UploadCloud className="h-4 w-4" />
                {isEdit ? "Replace image" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="mt-4 rounded-xl bg-white p-2">
              {previewUrl ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={previewUrl}
                    alt="Product preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
                  No image selected
                </div>
              )}
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="brand-name"
                className="text-sm font-medium text-foreground"
              >
                Brand name
              </label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(event) => setBrandName(event.target.value)}
                placeholder="e.g. Zara"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="dress-name"
                className="text-sm font-medium text-foreground"
              >
                Dress name
              </label>
              <Input
                id="dress-name"
                value={dressName}
                onChange={(event) => setDressName(event.target.value)}
                placeholder="e.g. Classic Linen"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="web-url"
              className="text-sm font-medium text-foreground"
            >
              Web URL
            </label>
            <Input
              id="web-url"
              type="url"
              value={webUrl}
              onChange={(event) => setWebUrl(event.target.value)}
              placeholder="https://brand.com/product"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : isEdit ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
