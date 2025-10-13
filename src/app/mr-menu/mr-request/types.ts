export type MRRequest = {
  material: string;
  materialType: string;
  materialGroup: string;
  buom: string;
  materialDescription: string;
  status: "approved" | "pending";
};
