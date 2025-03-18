import React from "react";

type props = {
  title: string;
  value: number;
  isCurrency: boolean;
  Icon: React.ElementType;
};

const StatistcCard = ({ Icon, isCurrency, title, value }: props) => {
  return (
    <div className="basis-64 flex-grow border-primary  p-6 rounded-md shadow-md border">
      <div className="flex justify-between items-center mb-4 w-full">
        <h2 className="font-medium capitalize">{title}</h2>
        <Icon className="w-4 h-4 text-neutral-600" />
      </div>
      <p className="font-extrabold text-2xl">
        {isCurrency
          ? value.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })
          : "+" + value}
      </p>
    </div>
  );
};

export default StatistcCard;
