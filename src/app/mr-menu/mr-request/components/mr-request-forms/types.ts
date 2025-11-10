import { MaterialMaster } from "@/app/mr-menu/material-master/types";
import { MaterialRateValues } from "./schema";

export interface MaterialRequestProps {
  materialOption: MaterialMaster[];
  onAddData: (newData: MaterialRateValues) => void;
}

export interface FormFields {
  materialCode: string;
  description: string;
  qtyReq: number;
  uom: string;
  purpose: string;
  materialGroup?: string;
  materialType?: string;
}

export interface MRRequestApprovalProps {
  data: MaterialRateValues;
  onUpdate: (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => void;
  user: string;
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
export interface FormValues {
  qtyReq: number | undefined;
  qtyApproved: number | undefined;
}
