import DeliveryMethodsComponent from "./components/DeliveryMethodsComponent";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

const EntregaPage = async () => {
  const user = await auth();

  if (!user?.user) {
    redirect("/");
  }

  return (
    <main className="flex flex-col min-h-screen items-center text-center px-4 py-10  rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-2 text-title">
        Escolha seu método de entrega
      </h2>
      <p className="text-price mb-10 text-sm max-w-md">
        Selecione a opção ideal para este momento especial.
      </p>
      <DeliveryMethodsComponent />
    </main>
  );
};

export default EntregaPage;
