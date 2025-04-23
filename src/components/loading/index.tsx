import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full max-h-screen gap-3 h-full flex justify-center items-center text-3xl  text-primary-foreground">
      Carregando dados <Loader2 size={30} className="animate-spin" />
    </div>
  );
};

export default Loading;
