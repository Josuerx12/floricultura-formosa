import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();
  const user = session?.user;

  if (user?.role !== "ADMIN" && user?.role !== "SELLER") {
    redirect("/");
  }

  return <div>Olá mundo</div>;
};

export default DashboardPage;
