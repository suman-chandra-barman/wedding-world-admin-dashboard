"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Settings,
  LogOut,
  ListTree,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/logo.svg";
import { LogoutModal } from "@/components/Modals/LogoutModal";

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Categories", icon: ListTree },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header - User Profile */}
      <SidebarHeader className="border-sidebar-border">
        <div className="py-4">
          <div
            className={`flex items-center justify-center gap-3`}
          >
            <div
              className={`flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300 ease-in-out ${isCollapsed ? "w-12 h-10" : "w-24 h-10"}`}
            >
              <Image
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content - Navigation Links */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href + "/"));

                return (
                  <SidebarMenuItem key={link.href} className="h-10">
                    <SidebarMenuButton
                      size="default"
                      asChild
                      isActive={isActive}
                      tooltip={link.label}
                      className={
                        isActive ? "bg-primary! h-full text-white!" : "h-full"
                      }
                    >
                      <Link href={link.href} className="min-w-9">
                        <Icon className="w-5! h-5!" />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer - Logout Button */}
      <SidebarFooter className="px-2 py-4">
        <Button
          className="w-full flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
          size={isCollapsed ? "icon" : "default"}
          onClick={handleLogoutClick}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </SidebarFooter>

      <LogoutModal open={logoutModalOpen} onOpenChange={setLogoutModalOpen} />
    </Sidebar>
  );
}
