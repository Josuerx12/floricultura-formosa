"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCheckout } from "@/hooks/use-checkout";
import FirstStep from "./steps/first-step";
import SecondStep from "./steps/second-step";
import SummaryStep from "./steps/summary-step";
import ThirdStep from "./steps/third-step";
import CheckoutTimeline from "./checkout-timeline";

export default function CheckoutDialog() {
  const { step, delivery, address, phone, message, to, from } = useCheckout();

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-btn-body text-btn-text shadow hover:bg-btn-body/80">
        Finalizar Pedido
      </DialogTrigger>
      <DialogContent>
        {step > 1 && (
          <CheckoutTimeline
            steps={[
              "Método de Entrega",
              "Endereço",
              "Destinatário",
              "Resumo",
              "Pagamento",
            ]}
          />
        )}

        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            Passo {step}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para continuar o pedido.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && <FirstStep />}
        {step === 2 && delivery && <SecondStep />}
        {step === 3 && <ThirdStep />}
        {step === 4 && (
          <SummaryStep
            delivery={delivery!}
            address={address}
            recipient={{ phone, message, to, from }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
