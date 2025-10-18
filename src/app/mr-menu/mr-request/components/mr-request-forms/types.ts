import { MaterialMaster } from "@/app/mr-menu/material-master/types";
import { MaterialRateValues } from "./schema";

export interface MaterialRequestProps {
  materialOption: MaterialMaster[];
  onAddData: (newData: MaterialRateValues) => void;
}
export type FormFields = {
  materialCode: string;
  description: string;
  qtyReq: string;
  uom: string;
  purpose: string;
};

// edit and mr approval
export interface MRRequestApprovalProps {
  data: MaterialRateValues;
  onUpdate: (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => void;
}

export interface EditMaterialRequestProps {
  data: MaterialRateValues;
  materialOption: MaterialMaster[];
  onUpdate: (
    reqId: string,
    srNo: string,
    updates: Partial<MaterialRateValues>,
  ) => void;
}
// mr approval form values
export interface FormValues {
  qtyReq: string;
  qtyApproved: string;
}
