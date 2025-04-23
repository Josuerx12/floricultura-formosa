"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();

  const hideFooter = pathname.startsWith("/dashboard");

  if (hideFooter) return null;

  return (
    <footer className="bg-primary-hard_pink text-primary w-full mx-auto py-6 px-4 mt-auto">
      <div className="max-w-screen-2xl mx-auto w-full flex gap-10 flex-wrap justify-between">
        <div className="flex-grow basis-64 text-center md:text-start">
          <h3 className="uppercase  font-medium">A empresa</h3>
          <ul className="text-sm flex flex-col gap-y-2 mt-2">
            <li>
              <Link href="/sobre" className="underline text-sm">
                Quem somos
              </Link>
            </li>
            <li>
              <Link href="/termos-de-uso" className="underline text-sm">
                Termos de Serviços
              </Link>
            </li>
            <li>
              <Link
                href="/politica-de-privacidade"
                className="underline text-sm"
              >
                Política de Privacidade
              </Link>
            </li>
            <li>
              <Link href="/politica-de-reembolso" className="underline text-sm">
                Política de Reembolso
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-grow basis-64 flex flex-col justify-start text-center md:text-start">
          <h3 className="uppercase  font-medium">ajuda</h3>

          <ul className="text-sm flex flex-col gap-y-2 mt-2">
            <li>
              <Link href="/rastreio" className="underline text-sm">
                Seu pedido
              </Link>
            </li>
            <li>
              <Link href="/rastreio" className="underline text-sm">
                Entrega
              </Link>
            </li>
            <li>
              <Link
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5522999712066&text=Ol%C3%A1%20estou%20acessando%20atrav%C3%A9s%20do%20site%20da%20floricultura%20e%20preciso%20de%20ajuda..."
                className="underline text-sm"
              >
                Fale com a gente
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-grow basis-64 text-center md:text-start">
          <h3 className="uppercase  font-medium">telefones</h3>

          <ul className="text-sm flex flex-col gap-y-2">
            <li>
              <Link
                target="_blank"
                href="https://api.whatsapp.com/send?phone=5522999712066&text=Ol%C3%A1%20estou%20acessando%20atrav%C3%A9s%20do%20site%20da%20floricultura%20e%20preciso%20de%20ajuda..."
              >
                (22) 9 99712-0066 - 08:00 às 18:00 (Seg à Sex) e 08:00 à 12:00
                aos sábados.
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-grow basis-64 flex flex-col  items-center">
          <h3 className="uppercase font-medium text-regular-600">
            siga a floricultura formosa
          </h3>

          <ul className="flex gap-5 mt-4">
            <li>
              <Link href={""}>
                <FaInstagram size={32} />
              </Link>
            </li>
            <li>
              <Link href={""}>
                <FaFacebook size={32} />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto mt-10 text-center">
        <p className="text-sm">CNPJ: 27.870.680/0001-50</p>
        <p className="text-sm">
          Razão Social: X.C. OLIVEIRA COMERCIO E SERVIÇOS DE FLORES NATURAIS
          EIRELI
        </p>
        <div className="mt-4 mx-auto">
          <p className="text-xs">
            Desenvolvido por
            <Link
              href="https://jcdev.com.br/pt/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              JC Dev
            </Link>
            . Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
