"use client";
import {
  Dialog,
  DialogClose,
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

const getVisualStepIndex = (step: number, delivery: boolean | undefined) => {
  const stepMap = delivery ? [1, 2, 3, 4] : [1, 3, 4];
  return stepMap.indexOf(step) + 1;
};

export default function CheckoutDialog({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: VoidFunction;
}) {
  const { step, delivery, address, phone, message, to, from, resetCheckout } =
    useCheckout();

  const steps = delivery
    ? ["Método de Entrega", "Endereço", "Destinatário", "Resumo"]
    : ["Método de Entrega", "Destinatário", "Resumo"];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        handleClose();
        resetCheckout();
      }}
    >
      <DialogContent>
        {step > 1 && <CheckoutTimeline steps={steps} delivery={delivery} />}

        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">
            Passo {getVisualStepIndex(step, delivery)}
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
