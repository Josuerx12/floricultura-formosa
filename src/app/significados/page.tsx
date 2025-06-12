import { ListAllFlowerMeanings } from "@/lib/actions/flower-meaning/infraestructure/actions/list-all";
import Image from "next/image";
import React from "react";

const FlowerMeaningsPage = async () => {
  const meanings = await ListAllFlowerMeanings();

  if (!meanings) {
    return <p>Nenhum significado encontrado!</p>;
  }

  return (
    <div className="flex flex-col gap-4 justify-center max-w-screen-lg mx-auto">
      <h2 className="capitalize text-center text-xl font-semibold">
        Significado das flores
      </h2>

      {meanings?.map((m) => {
        return (
          <div
            key={m.id}
            className="flex flex-col justify-center px-2 gap-2 w-full"
          >
            <h4 className="text-xl text-center">{m.name}</h4>
            <img
              src={m.image_url}
              alt={"Foto do significado da flor" + m.name}
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

export default FlowerMeaningsPage;
