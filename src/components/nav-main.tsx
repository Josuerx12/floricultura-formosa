"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const params = usePathname();

  const [firstRoute, secondRoute] = params?.replace("/", "")?.split("/");

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (!item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  className={`flex items-center text-sm gap-2 p-2 rounded ${
                    secondRoute === item.title.toLowerCase()
                      ? "bg-primary-foreground text-white hover:bg-primary-foreground/90 hover:text-white duration-200"
                      : ""
                  }`}
                  href={item.url}
                >
                  {item.icon && <item.icon size={16} />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          className={`${
                            secondRoute === subItem.title.toLowerCase()
                              ? "bg-primary-foreground text-white hover:bg-primary-foreground/90 hover:text-white duration-200"
                              : ""
                          }`}
                          asChild
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
