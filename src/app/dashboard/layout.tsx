import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard - ADM",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const user = session?.user;

  if (user?.role !== "ADMIN" && user?.role !== "SELLER") {
    redirect("/");
  }

  return (
    <div className="relative overflow-auto">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DashboardBreadcrumb />
            </div>
          </header>
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
