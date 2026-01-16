"use client";

import type { BankDetailsFormType } from "@/app/vendor-form/[token]/bank-details/schema";
import type { GovtCompliancesForm } from "@/app/vendor-form/[token]/govt/schema";
import type { VendorDetailForm } from "@/app/vendor-form/[token]/vendor-detail/schema";
import { createContext, useContext, useState, type ReactNode } from "react";

type StepStatus = "incomplete" | "editing" | "completed";

type VendorContextType = {
  // Data state
  vendor: VendorDetailForm | null;
  govtForm: GovtCompliancesForm | null;
  bankDetails: BankDetailsFormType | null;

  // Setters for data
  setVendor: (data: VendorDetailForm) => void;
  setGovtForm: (data: GovtCompliancesForm) => void;
  setBankDetails: (data: BankDetailsFormType) => void;

  // Step completion tracking
  stepStatus: {
    vendor: StepStatus;
    govt: StepStatus;
    bank: StepStatus;
  };

  // Mark step as completed (validated and submitted)
  completeStep: (step: "vendor" | "govt" | "bank") => void;

  // Check if a step can be accessed
  canAccessStep: (stepIndex: number) => boolean;

  // Reset all data
  resetForm: () => void;
};

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export function VendorFormProvider({ children }: { children: ReactNode }) {
  const [vendor, setVendorData] = useState<VendorDetailForm | null>(null);
  const [govtForm, setGovtFormData] = useState<GovtCompliancesForm | null>(
    null,
  );
  const [bankDetails, setBankDetailsData] =
    useState<BankDetailsFormType | null>(null);

  const [stepStatus, setStepStatus] = useState<{
    vendor: StepStatus;
    govt: StepStatus;
    bank: StepStatus;
  }>({
    vendor: "incomplete",
    govt: "incomplete",
    bank: "incomplete",
  });

  const setVendor = (data: VendorDetailForm) => {
    setVendorData(data);
    // Mark as editing if not already completed
    if (stepStatus.vendor === "incomplete") {
      setStepStatus((prev) => ({ ...prev, vendor: "editing" }));
    }
  };

  const setGovtForm = (data: GovtCompliancesForm) => {
    setGovtFormData(data);
    if (stepStatus.govt === "incomplete") {
      setStepStatus((prev) => ({ ...prev, govt: "editing" }));
    }
  };

  const setBankDetails = (data: BankDetailsFormType) => {
    setBankDetailsData(data);
    if (stepStatus.bank === "incomplete") {
      setStepStatus((prev) => ({ ...prev, bank: "editing" }));
    }
  };

  const completeStep = (step: "vendor" | "govt" | "bank") => {
    setStepStatus((prev) => ({ ...prev, [step]: "completed" }));
  };

  const canAccessStep = (stepIndex: number): boolean => {
    // Step 0 (Vendor Details) - always accessible
    if (stepIndex === 0) return true;

    // Step 1 (Govt Form) - accessible if vendor step is completed
    if (stepIndex === 1) {
      return stepStatus.vendor === "completed";
    }

    // Step 2 (Bank Details) - accessible if govt step is completed
    if (stepIndex === 2) {
      return (
        stepStatus.vendor === "completed" && stepStatus.govt === "completed"
      );
    }

    // Step 3 (Preview) - accessible if all steps are completed
    if (stepIndex === 3) {
      return (
        stepStatus.vendor === "completed" &&
        stepStatus.govt === "completed" &&
        stepStatus.bank === "completed"
      );
    }

    return false;
  };

  const resetForm = () => {
    setVendorData(null);
    setGovtFormData(null);
    setBankDetailsData(null);
    setStepStatus({
      vendor: "incomplete",
      govt: "incomplete",
      bank: "incomplete",
    });
  };

  return (
    <VendorContext.Provider
      value={{
        vendor,
        govtForm,
        bankDetails,
        setVendor,
        setGovtForm,
        setBankDetails,
        stepStatus,
        completeStep,
        canAccessStep,
        resetForm,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendorForm() {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendorForm must be used within VendorFormProvider");
  }
  return context;
}
