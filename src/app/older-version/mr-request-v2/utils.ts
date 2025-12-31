import { MaterialRateValues } from "./components/mr-request-forms/schema";
import { materialData } from "./data";

export const materialRequest: MaterialRateValues[] = materialData.map(
  (item) => ({
    ...item,
    qtyReq: item.qtyReq ? Number(item.qtyReq) : 0,
    qtyApproved: item.qtyApproved ? Number(item.qtyApproved) : 0,
    qtyIssued: item.qtyIssued ? Number(item.qtyIssued) : 0,
  }),
);
