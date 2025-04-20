import { GetFlowerMeaningById } from "@/lib/actions/flower-meaning/infraestructure/actions/get-by-id";
import Image from "next/image";
import React from "react";

const MeaningPage = async ({ params }: { params: any }) => {
  const p = await params;
  const id = p.id;
  const meaning = await GetFlowerMeaningById(id);

  return (
    <div className="min-h-screen bg-pink-50 flex justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full h-fit p-6 md:p-10 flex flex-col items-center gap-6">
        <Image
          src={meaning.imageUrl}
          width={300}
          height={300}
          alt="Significado Imagem"
          className="rounded-lg object-cover shadow-md"
        />
        <h2 className="text-3xl font-bold text-pink-600 text-center">
          {meaning.name}
        </h2>
        <div
          className="text-gray-700 text-base leading-relaxed prose prose-p:my-2"
          dangerouslySetInnerHTML={{ __html: meaning.description }}
        />
      </div>
    </div>
  );
};

export default MeaningPage;
