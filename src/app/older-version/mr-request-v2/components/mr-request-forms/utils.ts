import { MaterialRateValues } from "./schema";

export const generateRequestId = (): string => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  return `MR${timestamp}`;
};

export const renumberItems = (
  itemsList: MaterialRateValues[],
): MaterialRateValues[] => {
  return itemsList.map((item, index) => ({
    ...item,
    srNo: String((index + 1) * 10),
  }));
};
