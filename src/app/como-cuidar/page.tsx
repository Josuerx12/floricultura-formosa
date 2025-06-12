import { ListAllFlowerCares } from "@/lib/actions/flower-care/infraestructure/actions/list-all";
import React from "react";
import Image from "next/image";

const HowToCarePage = async () => {
  const cares = await ListAllFlowerCares();

  if (!cares) {
    return <p>Nenhum cuidado adicionado!</p>;
  }

  return (
    <div className="flex flex-col gap-4 justify-center max-w-screen-lg mx-auto">
      <h2 className="capitalize text-center text-xl font-semibold">
        Como cuidar das flores
      </h2>

      {cares?.map((m) => {
        return (
          <div
            key={m.id}
            className="flex flex-col justify-center px-2 gap-2 w-full"
          >
            <h4 className="text-xl text-center">{m.title}</h4>
            <img
              src={m.image_url}
              alt={"Foto da flor da explicação do cuidado" + m.title}
              width={500}
              height={500}
              className="mx-auto"
            />

            <div
              className="text-base leading-relaxed prose prose-p:my-2 "
              dangerouslySetInnerHTML={{ __html: m.description }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default HowToCarePage;
