import React from "react";

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Termos de Uso</h1>
        <p className="mb-4">
          Bem-vindo(a) ao nosso site! Ao acessar e utilizar nossos serviços,
          você concorda com os seguintes termos e condições.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Uso dos Serviços</h2>
        <p className="mb-4">
          Nossos serviços são destinados para uso pessoal e comercial,
          respeitando as diretrizes estabelecidas neste documento. É proibido o
          uso indevido ou ilegal dos nossos serviços.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Privacidade</h2>
        <p className="mb-4">
          Os dados dos usuários são armazenados de maneira segura e seguem a Lei
          Geral de Proteção de Dados (LGPD). Para mais detalhes, consulte nossa
          Política de Privacidade.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Alterações nos Termos
        </h2>
        <p className="mb-4">
          Reservamo-nos o direito de modificar estes Termos de Uso a qualquer
          momento. As alterações serão publicadas nesta página e entrarão em
          vigor imediatamente.
        </p>
        <p className="mt-6 text-sm">
          Última atualização: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
