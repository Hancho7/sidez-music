// app/(dashboard)/layout.tsx
import { SidebarProvider } from "@/components/ui/SidebarContext";
import Sidebar from "@/components/ui/Sidebar";
import MainContent from "@/components/ui/MainContent";
import { DeviceGuard } from "@/components/ui/DeviceGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DeviceGuard minWidth={1024}>
      <SidebarProvider>
        <div className="flex min-h-dvh">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
      </SidebarProvider>
    </DeviceGuard>
  );
}
