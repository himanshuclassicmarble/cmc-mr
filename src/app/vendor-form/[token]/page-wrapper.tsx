"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronRight,
  Building2,
  ShieldCheck,
  Landmark,
  Eye,
  Lock,
  Edit2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVendorForm } from "@/hooks/vendorcontext";
import { toast } from "sonner";

import VendorDetails, {
  type VendorDetailsHandle,
} from "./vendor-detail/vendordetail";
import GovtForm, { type GovtFormHandle } from "./govt/govtform";
import BankDetails, { type BankDetailsHandle } from "./bank-details/bankdetail";
import Preview from "./preview/preview";

interface PageWrapperProps {
  token: string;
  linkData: {
    createdBy: string;
    department: string;
    plant: string;
    empCode: string;
  };
}

const STEPS = [
  {
    id: 0,
    label: "Vendor Details",
    icon: Building2,
    key: "vendor" as const,
  },
  {
    id: 1,
    label: "Govt. Compliance",
    icon: ShieldCheck,
    key: "govt" as const,
  },
  {
    id: 2,
    label: "Bank Details",
    icon: Landmark,
    key: "bank" as const,
  },
  {
    id: 3,
    label: "Preview",
    icon: Eye,
    key: "preview" as const,
  },
];

export default function PageWrapper({ token, linkData }: PageWrapperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { stepStatus, canAccessStep, vendor, govtForm, bankDetails } =
    useVendorForm();

  const vendorRef = useRef<VendorDetailsHandle>(null);
  const govtRef = useRef<GovtFormHandle>(null);
  const bankRef = useRef<BankDetailsHandle>(null);

  // Log token on mount to verify it's being passed
  useEffect(() => {
    console.log("PageWrapper mounted with token:", token);
  }, [token]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (canAccessStep(stepIndex) || stepIndex <= currentStep) {
      setDirection(stepIndex > currentStep ? 1 : -1);
      setCurrentStep(stepIndex);
    }
  };

  const handleSubmit = () => {
    if (currentStep === 0) {
      vendorRef.current?.submit();
    } else if (currentStep === 1) {
      govtRef.current?.submit();
    } else if (currentStep === 2) {
      bankRef.current?.submit();
    }
  };

  const handleFinalSubmit = async () => {
    // Verify we have the token
    if (!token) {
      toast.error("Missing form token. Please try accessing the form again.");
      console.error("Token is missing:", token);
      return;
    }

    // Verify all form data is present
    if (!vendor || !govtForm || !bankDetails) {
      toast.error("Please complete all form sections before submitting.");
      console.error("Missing form data:", { vendor, govtForm, bankDetails });
      return;
    }

    setIsSubmitting(true);

    try {
      // Log the data being sent for debugging
      console.log("Submitting data:", {
        token,
        vendorData: vendor,
        govtData: govtForm,
        bankData: bankDetails,
      });

      const response = await fetch(`/api/vendor-form/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          vendorData: vendor,
          govtData: govtForm,
          bankData: bankDetails,
        }),
      });

      const result = await response.json();

      console.log("API Response:", result);

      if (response.ok) {
        toast.success("Application submitted successfully!");

        // Optionally redirect to a thank you page
        setTimeout(() => {
          // window.location.href = "/vendor-form/thank-you";
          alert("Form submitted successfully! You can close this page.");
        }, 1500);
      } else {
        toast.error(result.error || "Submission failed. Please try again.");
        console.error("Submission error:", result);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        "An error occurred while submitting the form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    const stepKey = STEPS[stepIndex].key;

    if (stepKey === "preview") {
      return stepStatus.vendor === "completed" &&
        stepStatus.govt === "completed" &&
        stepStatus.bank === "completed"
        ? "completed"
        : "incomplete";
    }

    return stepStatus[stepKey as keyof typeof stepStatus];
  };

  const isStepAccessible = (stepIndex: number) => {
    return canAccessStep(stepIndex) || stepIndex <= currentStep;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Vendor Registration Form
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete all steps to register as a vendor
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-6 sm:mb-8">
          <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute left-0 right-0 top-5 -z-10 h-px bg-border" />
            <motion.div
              className="absolute left-0 top-5 -z-10 h-px bg-primary"
              initial={false}
              animate={{
                width: `${(currentStep / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />

            {STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const isAccessible = isStepAccessible(index);
              const isCurrent = currentStep === index;
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={!isAccessible}
                  className={cn(
                    "relative flex flex-col items-center gap-2",
                    !isAccessible && "cursor-not-allowed opacity-50",
                  )}
                >
                  {/* Circle */}
                  <motion.div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2",
                      isCurrent &&
                        "border-primary bg-primary text-primary-foreground",
                      status === "completed" &&
                        !isCurrent &&
                        "border-primary bg-primary text-primary-foreground",
                      status === "editing" &&
                        !isCurrent &&
                        "border-amber-500 bg-amber-50 text-amber-700",
                      status === "incomplete" &&
                        !isCurrent &&
                        "border-input bg-background text-muted-foreground",
                    )}
                    animate={
                      isCurrent
                        ? {
                            scale: [1, 1.05, 1],
                          }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${status}-${isCurrent}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {status === "completed" && !isCurrent ? (
                          <Check className="h-5 w-5" />
                        ) : status === "editing" && !isCurrent ? (
                          <Edit2 className="h-4 w-4" />
                        ) : !isAccessible ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>

                  {/* Label */}
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </span>

                  {/* Status Badge */}
                  {status === "editing" && !isCurrent && (
                    <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-3 sm:p-6">
            <div className="min-h-[400px] sm:min-h-[500px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                >
                  {currentStep === 0 && (
                    <VendorDetails ref={vendorRef} onNext={handleNext} />
                  )}
                  {currentStep === 1 && (
                    <GovtForm ref={govtRef} onNext={handleNext} />
                  )}
                  {currentStep === 2 && (
                    <BankDetails ref={bankRef} onNext={handleNext} />
                  )}
                  {currentStep === 3 && (
                    <Preview
                      onPrev={handlePrev}
                      onSubmit={handleFinalSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div className="mt-6 flex items-center justify-between border-t pt-4 sm:mt-8 sm:pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {STEPS.length}
                </div>

                <Button onClick={handleSubmit}>
                  {currentStep === STEPS.length - 2 ? "Review" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-4 text-center sm:mt-6">
          <p className="text-xs text-muted-foreground sm:text-sm">
            {stepStatus.vendor === "editing" ||
            stepStatus.govt === "editing" ||
            stepStatus.bank === "editing" ? (
              <>
                <span className="inline-flex items-center gap-1 font-medium text-amber-600">
                  <Edit2 className="h-3 w-3" />
                  You have unsaved changes
                </span>
                {" - "}Click "Next" to validate and save before proceeding
              </>
            ) : (
              "You can navigate back to any completed step to make changes"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
