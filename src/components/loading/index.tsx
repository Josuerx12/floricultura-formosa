import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center text-3xl bg-primary text-primary-foreground">
      Carregando dados <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loading;
