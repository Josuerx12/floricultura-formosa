// components/checkout/SummaryStep.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryProps {
  delivery: boolean;
  address?: any;
  recipient: {
    phone?: string;
    message?: string;
    to?: string;
    from?: string;
  };
}

export default function SummaryStep({
  delivery,
  address,
  recipient,
}: SummaryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
      {delivery && address && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <p>
              <strong>Rua:</strong> {address.street}, {address.number}
            </p>
            <p>
              <strong>Bairro:</strong> {address.district}
            </p>
            <p>
              <strong>Cidade/Estado:</strong> {address.city} - {address.state}
            </p>
            <p>
              <strong>CEP:</strong> {address.zipCode}
            </p>
            <p>
              <strong>Complemento:</strong> {address.complement || "Nenhum"}
            </p>
            {/* <p>
              <strong>Taxa de Entrega:</strong> R${" "}
              {address}
            </p> */}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4 space-y-1">
          <p>
            <strong>Telefone:</strong> {recipient.phone}
          </p>
          <p>
            <strong>Para:</strong> {recipient.to}
          </p>
          <p>
            <strong>De:</strong> {recipient.from}
          </p>
          <p>
            <strong>Mensagem:</strong> {recipient.message}
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline">Ir para Pagamento</Button>
      </div>
    </div>
  );
}
