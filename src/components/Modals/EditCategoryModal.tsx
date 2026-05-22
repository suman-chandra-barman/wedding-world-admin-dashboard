"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => Promise<void> | void;
  initialName?: string;
  isLoading?: boolean;
}

export default function EditCategoryModal({
  open,
  onOpenChange,
  onSave,
  initialName = "",
  isLoading = false,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setError("");
      return;
    }

    setName(initialName);
    setError("");
  }, [open, initialName]);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    setError("");

    try {
      await onSave(trimmedName);
      onOpenChange(false);
    } catch {
      // Parent handles error feedback.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Edit Category
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground pt-1">
            Update the category name to keep your catalog fresh.
          </p>
        </DialogHeader>

        <div className="space-y-2 py-5">
          <label
            htmlFor="edit-category-name"
            className="text-sm font-medium text-foreground"
          >
            Category name
          </label>
          <Input
            id="edit-category-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Type a category name"
            className={error ? "border-destructive" : ""}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
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
            onClick={handleSave}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
