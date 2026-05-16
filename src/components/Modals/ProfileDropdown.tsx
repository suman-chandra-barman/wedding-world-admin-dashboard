/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { LogoutModal } from "./LogoutModal";
import { User as AuthUser } from "@/app/types/auth.type";

const getProfileImageUrl = (image?: string | null) => {
  if (!image) return "";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? "";
  return `${baseUrl}${image}`;
};

const getDisplayName = (user: AuthUser | null) => {
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

interface ProfileDropdownProps {
  user: AuthUser | null;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };

  const displayName = getDisplayName(user);
  const profileImageUrl = getProfileImageUrl(user?.profile_image);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-3 pl-1 py-1 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  width={40}
                  height={40}
                />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </div>
            {displayName && (
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {displayName}
                </p>
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/settings"} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </>
  );
}
