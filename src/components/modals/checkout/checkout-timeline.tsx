"use client";

import { useCheckout } from "@/hooks/use-checkout";

interface TimelineProps {
  steps: string[];
  delivery?: boolean;
}

export default function CheckoutTimeline({ steps, delivery }: TimelineProps) {
  const { step, goToStep } = useCheckout();

  // Mapeia os steps visuais de acordo com os steps reais
  const visualSteps = delivery ? [1, 2, 3, 4] : [1, 3, 4];

  return (
    <div className="mb-4 flex justify-center">
      <div className="grid grid-cols-2 gap-4 md:flex md:space-x-8 md:gap-0 md:justify-center px-4">
        {steps.map((stepName, visualIndex) => {
          const realStep = visualSteps[visualIndex];
          const isActive = step === realStep;
          const isCompleted = step > realStep;

          return (
            <div
              key={visualIndex}
              className={`flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                isCompleted || isActive ? "text-blue-500" : "text-gray-500"
              }`}
              onClick={() => goToStep(realStep)}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isCompleted || isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {visualIndex + 1}
              </div>
              <span className="text-xs md:text-sm">{stepName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
