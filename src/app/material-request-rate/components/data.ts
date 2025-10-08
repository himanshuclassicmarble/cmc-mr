import { MaterialRateRequestData } from "./types";

export const materialRateRequest: MaterialRateRequestData = {
  requesterEmail: "rajiv.sharma@company.com",
  plantName: "Mumbai Plant",
  headOfDepartment: "Amit Verma",
  storeKeeperName: "Neha Singh",
  items: [
    {
      requestId: "MRR-001",
      serialNumber: 1,
      itemCode: undefined,
      details: "",
      quantityRequired: undefined,
      unitOfMeasurement: "kg",
      purpose: "",
    },
  ],
};
