"use client";

import * as React from "react";
import { ChartLine, Flower, HandCoins, Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

// This is sample data.
const data = {
  navMain: [
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
      title: "Vendas",
      url: "/dashboard/vendas",
      icon: HandCoins,
    },
    {
      title: "Usuários",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
      ],
    },
    {
      title: "Métricas",
      url: "#",
      icon: ChartLine,
      items: [
        {
          title: "Gerais",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className="absolute" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
