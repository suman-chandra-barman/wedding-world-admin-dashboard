import { AuthProvider } from "@/components/AuthProvider";
import { DashboardSidebar } from "@/components/Shared/DashboardSidebar";
import { Header } from "@/components/Shared/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <DashboardSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
          <Header title="Admin Dashboard" />
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
            {children}
          </div>
        </SidebarInset>
      </AuthProvider>
    </SidebarProvider>
  );
}

export default Providers;
