"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil } from "lucide-react";
import Image from "next/image";
import EditUserInfoModal from "@/components/Modals/EditUserInfoModal";
import ChangePasswordModal from "@/components/Modals/ChangePasswordModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User } from "@/app/types/auth.type";

const getProfileImageUrl = (image?: string | null) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";
  return `${baseUrl}${image}`;
};

const getDisplayName = (user: User | null) => {
  if (!user) return "";
  const firstName = user.first_name?.trim() ?? "";
  const lastName = user.last_name?.trim() ?? "";
  const combined = `${firstName} ${lastName}`.trim();
  const safeFullName = user.full_name?.includes("undefined")
    ? ""
    : user.full_name;
  return (
    combined ||
    safeFullName ||
    user.username ||
    user.email ||
    user.email_address ||
    ""
  );
};

export default function SettingsPage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const displayName = getDisplayName(user);
  const profileImageUrl = getProfileImageUrl(user?.profile_image);
  const displayEmail = user?.email ?? user?.email_address ?? "";
  const displayInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "U";
  const displayFirstName = user?.first_name ?? "";
  const displayLastName = user?.last_name ?? "";

  return (
    <main className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Personal Information
        </h1>
        <Button
          onClick={() => setIsEditModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-lg px-6"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card - Left Side */}
        <div className="shrink-0">
          <div className="w-52 rounded-2xl border-2 border-primary/30 p-6 bg-card flex flex-col items-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full overflow-hidden bg-muted mb-4">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={displayName}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {displayInitial}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Label */}
            <span className="text-sm font-medium text-muted-foreground mb-1">
              Admin
            </span>

            {/* Name */}
            <span className="text-xl font-semibold text-foreground">
              {displayName}
            </span>
          </div>
        </div>

        {/* Information Fields - Right Side */}
        <div className="flex-1 space-y-4">
          {/* First Name Field */}
          <div className="bg-card rounded-lg px-4 py-3 border border-border">
            <p className="text-sm text-muted-foreground">First Name</p>
            <p className="text-foreground">{displayFirstName || "-"}</p>
          </div>

          {/* Last Name Field */}
          <div className="bg-card rounded-lg px-4 py-3 border border-border">
            <p className="text-sm text-muted-foreground">Last Name</p>
            <p className="text-foreground">{displayLastName || "-"}</p>
          </div>

          {/* Email Field */}
          <div className="bg-card rounded-lg px-4 py-3 border border-border">
            <p className="text-muted-foreground">{displayEmail}</p>
          </div>

          {/* Change Password Button */}
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center justify-between bg-card hover:bg-muted/50 transition-colors rounded-lg px-4 py-3 border border-border group"
          >
            <span className="text-foreground">Change password</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <EditUserInfoModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={user}
      />

      <ChangePasswordModal
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </main>
  );
}
