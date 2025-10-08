export type MaterialRateItem = {
  requestId: string;
  serialNumber: number;
  itemCode: number | undefined;
  details?: string;
  quantityRequired: number | undefined;
  unitOfMeasurement: string;
  purpose: string;
};
