"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ProfileDropdown } from "../Modals/ProfileDropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function Header({ title }: { title: string }) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="h-16 flex shrink-0 items-center gap-2 border-b bg-white px-4">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-lg md:text-2xl font-semibold text-gray-900">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}
