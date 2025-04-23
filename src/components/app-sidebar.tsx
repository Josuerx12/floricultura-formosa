"use client";

import * as React from "react";
import {
  ChartLine,
  Flower,
  HandCoins,
  Home,
  Image,
  Info,
  MapPin,
  Package,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import UserDropdown from "./user-dropdown";

// This is sample data.
const data = {
  navMain: [
    {
      title: "Pagina Inicial",
      url: "/",
      isActive: true,
      icon: Home,
    },
    {
      title: "Métricas",
      url: "/dashboard",
      isActive: true,
      icon: ChartLine,
    },
    {
      title: "Vendas",
      url: "/dashboard/vendas",
      isActive: true,
      icon: HandCoins,
    },
    {
      title: "Produtos e Promoções",
      url: "#",
      icon: Flower,
      isActive: true,
      items: [
        {
          title: "Categorias",
          url: "/dashboard/categorias",
        },
        {
          title: "Sub-categorias",
          url: "/dashboard/sub-categorias",
        },
        {
          title: "Produtos",
          url: "/dashboard/produtos",
        },
        {
          title: "Ofertas",
          url: "/dashboard/ofertas",
        },
      ],
    },
    {
      title: "Utilitarios e Informações",
      url: "#",
      icon: Info,
      isActive: true,
      items: [
        {
          title: "Sugestão de Mensagens",
          url: "/dashboard/sugestao-messagens",
        },
        {
          title: "Como cuidar",
          url: "/dashboard/como-cuidar",
        },
        {
          title: "Significados",
          url: "/dashboard/significados",
        },
        {
          title: "Termos de Uso",
          url: "/dashboard/termos-de-uso",
        },
        {
          title: "Politica de Privacidade",
          url: "/dashboard/politica-de-privacidade",
        },
        {
          title: "Politica de Reembolso",
          url: "/dashboard/politica-de-reembolso",
        },
      ],
    },
    {
      title: "Bairros",
      url: "/dashboard/bairros",
      isActive: true,
      icon: MapPin,
    },
    {
      title: "Banners",
      url: "/dashboard/banners",
      isActive: true,
      icon: Image,
    },
    {
      title: "Usuários",
      url: "/dashboard/usuarios",
      isActive: true,
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const user = session?.data?.user;
  return (
    <Sidebar collapsible="icon" className="absolute" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />

        <div className="flex flex-col gap-y-2 mt-auto mx-auto pb-4">
          {user && <UserDropdown user={user} />}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
