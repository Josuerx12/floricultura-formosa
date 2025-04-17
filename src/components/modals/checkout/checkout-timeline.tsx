"use client";

import { useCheckout } from "@/hooks/use-checkout";

interface TimelineProps {
  steps: string[];
}

export default function CheckoutTimeline({ steps }: TimelineProps) {
  const { step, goToStep } = useCheckout();

  return (
    <div className="mb-4">
      <div className="flex flex-wrap space-x-4 md:space-x-8">
        {steps.map((stepName, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 cursor-pointer ${
              step >= index + 1 ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => goToStep(index + 1)}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step >= index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs md:text-sm">{stepName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
