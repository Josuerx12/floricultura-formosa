import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className=" min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
        <p className="mb-4">
          Nós, da X.C. OLIVEIRA COMERCIO E SERVIÇOS DE FLORES NATURAIS EIRELI,
          estamos comprometidos em proteger a sua privacidade. Todos os dados
          fornecidos por nossos usuários são armazenados com segurança e
          tratados de acordo com a Lei Geral de Proteção de Dados (LGPD - Lei nº
          13.709/2018).
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">
          Coleta e Uso de Dados
        </h2>
        <p className="mb-4">
          Coletamos informações essenciais para a melhoria de nossos serviços,
          sempre garantindo transparência e segurança. Os dados coletados podem
          incluir nome, e-mail, telefone e informações necessárias para a
          prestação dos nossos serviços.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Segurança dos Dados</h2>
        <p className="mb-4">
          Utilizamos medidas de segurança rigorosas para proteger as informações
          dos usuários contra acesso não autorizado, perda ou alteração
          indevida.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Direitos do Usuário</h2>
        <p className="mb-4">
          Você tem o direito de acessar, corrigir ou excluir seus dados pessoais
          a qualquer momento. Para isso, entre em contato conosco.
        </p>
        <p className="mt-6 text-sm">
          Última atualização: {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
