import { MaterialMaster } from "@/app/material-master/types";
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
  isAuthorised: boolean;
  data: MaterialRateValues;
  isDisabled: boolean;
}

export interface EditMaterialRequestProps {
  data: MaterialRateValues;
  materialOption: MaterialMaster[];
}
export interface FormValues {
  qtyReq: number;
  qtyApproved: number | undefined;
}

export interface MaterialOption {
  materialCode: string;
  materialType: string;
  materialGroup: string;
  uom: string;
  materialDescription: string;
}
