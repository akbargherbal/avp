import React from "react";
import { RotateCcw, SkipBack, ChevronRight } from "lucide-react";
import { useNavigation } from "../contexts/NavigationContext";

const ControlBar = ({ onPrev, onNext, onReset }) => {
  const {
    currentStep,
    totalSteps,
    prevStep: ctxPrevStep,
    nextStep: ctxNextStep,
    resetTrace: ctxResetTrace,
  } = useNavigation();

  console.log("ControlBar re-rendered", { currentStep, totalSteps });

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= totalSteps - 1;

  // Use prop handler if provided (for prediction logic), otherwise context default
  const handlePrev = onPrev || ctxPrevStep;
  const handleNext = onNext || ctxNextStep;
  const handleReset = onReset || ctxResetTrace;

  return (
    <>
      <button
        onClick={handleReset}
        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <RotateCcw size={20} />
        Reset
      </button>

      <button
        onClick={handlePrev}
        disabled={isFirstStep}
        className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
      >
        <SkipBack size={20} />
        Previous
      </button>

      <button
        onClick={handleNext}
        disabled={isLastStep}
        className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold"
      >
        Next Step
        <ChevronRight size={20} />
      </button>
    </>
  );
};

export default ControlBar;
