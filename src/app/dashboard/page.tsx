import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await auth();
  const user = session?.user;

  if (user?.role !== "ADMIN" && user?.role !== "SELLER") {
    redirect("/");
  }

  return <div>page</div>;
};

export default page;
