"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const hideFooter = pathname.startsWith("/dashboard");

  if (hideFooter) return null;

  return (
    <footer className="bg-primary-hard_pink text-primary py-6 px-4 text-center mt-auto">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm">CNPJ: 27.870.680/0001-50</p>
        <p className="text-sm">
          Razão Social: X.C. OLIVEIRA COMERCIO E SERVIÇOS DE FLORES NATURAIS
          EIRELI
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link href="/politica-de-privacidade" className="underline text-sm">
            Política de Privacidade
          </Link>
          <Link href="/termos-de-uso" className="underline text-sm">
            Termos de Uso
          </Link>
        </div>
        <div className="mt-4">
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
