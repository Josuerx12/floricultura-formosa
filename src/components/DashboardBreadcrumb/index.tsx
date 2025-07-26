"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

const DashboardBreadcrumb = () => {
  const params = usePathname();

  const [firstRoute, secondRoute, thirdRoute] = params
    ?.replace("/", "")
    ?.split("/");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <Link className="capitalize" href={`/${firstRoute}`}>
            {firstRoute}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Link className="capitalize" href={`/${firstRoute}/${secondRoute}`}>
              {secondRoute}
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <Link
              className="capitalize"
              href={`/${firstRoute}/${secondRoute}/${thirdRoute}`}
            >
              {thirdRoute}
            </Link>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
