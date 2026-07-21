"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { User } from "@/app/types/auth.type";
import { useUpdateProfileMutation } from "@/redux/features/auth/authApi";
import { toast } from "sonner";

const getProfileImageUrl = (image?: string | null) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";
  return `${baseUrl}${image}`;
};

const getInitials = (
  firstName?: string,
  lastName?: string,
  fallback?: string,
) => {
  const first = firstName?.trim().charAt(0) ?? "";
  const last = lastName?.trim().charAt(0) ?? "";
  const combined = `${first}${last}`.trim();
  if (combined) return combined.toUpperCase();
  if (fallback?.trim()) return fallback.trim().charAt(0).toUpperCase();
  return "U";
};

interface EditUserInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
  user: User | null;
}

export default function EditUserInfoModal({
  open,
  onOpenChange,
  onSave,
  user,
}: EditUserInfoModalProps) {
  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [email, setEmail] = useState(user?.email ?? user?.email_address ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    getProfileImageUrl(user?.profile_image),
  );

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (!open) return;
    setFirstName(user?.first_name ?? "");
    setLastName(user?.last_name ?? "");
    setEmail(user?.email ?? user?.email_address ?? "");
    setImageFile(null);
    setPreviewImage(getProfileImageUrl(user?.profile_image));
  }, [open, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    if (imageFile) {
      formData.append("profile_image", imageFile);
    }
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
      onSave?.();
      onOpenChange(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFirstName(user?.first_name ?? "");
    setLastName(user?.last_name ?? "");
    setEmail(user?.email ?? user?.email_address ?? "");
    setImageFile(null);
    setPreviewImage(getProfileImageUrl(user?.profile_image));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Edit Account Info
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground pt-1">
            Make changes to your profile here. Click save when you&apos;re done.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Avatar Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-primary">
                      {getInitials(firstName, lastName, email)}
                    </span>
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* First Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-foreground"
            >
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Last Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-foreground"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              readOnly
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!email || isLoading}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
