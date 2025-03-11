import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Floricultura Formosa - Dashboard",
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
          <div>
            <Suspense
              fallback={
                <div className="w-full h-screen flex justify-center items-center text-3xl bg-primary text-primary-foreground">
                  Carregando dados <Loader2 className="animate-spin" />
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
