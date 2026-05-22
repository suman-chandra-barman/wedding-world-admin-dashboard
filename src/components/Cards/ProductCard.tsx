"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CategoryImage } from "@/app/types/category.type";
import Link from "next/link";

interface ProductCardProps {
  product: CategoryImage;
  categoryName: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  product,
  categoryName,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-amber-100 bg-white shadow-sm">
      <div className="relative h-36 w-full bg-amber-50/40">
        <Image
          src={product.image_url}
          alt={categoryName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-2"
        />
        {product.web_url && (
          <Link
            href={product.web_url}
            target="_blank"
            rel="noreferrer"
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-amber-700 shadow"
          >
            <ExternalLink className="h-3 w-3" />
            Visit
          </Link>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Brand
          </p>
          <p className="text-sm font-semibold text-foreground line-clamp-1">
            {product.brand_name?.trim() || "Not set"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Dress
          </p>
          <p className="text-xs font-medium text-foreground line-clamp-1">
            {product.dress_name?.trim() || "Not set"}
          </p>
        </div>
        <div className="mt-auto flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 flex-1 text-xs"
            onClick={onEdit}
          >
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="h-8 flex-1 text-xs"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
