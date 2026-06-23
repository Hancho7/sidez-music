// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/components/ui/SidebarContext";
import Sidebar from "@/components/ui/Sidebar";
import MainContent from "@/components/ui/MainContent";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-dvh">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
