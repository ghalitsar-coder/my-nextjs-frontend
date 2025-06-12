import { Step } from "./ProgressSteps";

// Routes corresponding to each step
export const STEP_ROUTES = {
  1: "/order",
  2: "/payment",
  3: "/payment-complete",
};

// Shared steps configuration for the order flow
export const ORDER_FLOW_STEPS: Step[] = [
  { id: 1, label: "Order" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Complete" },
];

// Helper function to get step information
export const getStepInfo = (currentStep: number) => {
  return {
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === ORDER_FLOW_STEPS.length,
    nextStep:
      currentStep < ORDER_FLOW_STEPS.length ? currentStep + 1 : currentStep,
    nextStepRoute:
      currentStep < ORDER_FLOW_STEPS.length
        ? STEP_ROUTES[(currentStep + 1) as keyof typeof STEP_ROUTES]
        : STEP_ROUTES[currentStep as keyof typeof STEP_ROUTES],
    prevStep: currentStep > 1 ? currentStep - 1 : currentStep,
    prevStepRoute:
      currentStep > 1
        ? STEP_ROUTES[(currentStep - 1) as keyof typeof STEP_ROUTES]
        : STEP_ROUTES[1],
    currentStepRoute: STEP_ROUTES[currentStep as keyof typeof STEP_ROUTES],
  };
};
