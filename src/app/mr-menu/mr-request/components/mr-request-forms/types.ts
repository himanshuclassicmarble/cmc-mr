import { MaterialOption } from "../mr-request-table/types";
import { MaterialRateValues } from "./schema";

export interface MaterialRequestProps {
  materialOption: MaterialOption[];
  onAddData: (newData: MaterialRateValues) => void;
}
export type FormFields = {
  materialCode: string;
  description: string;
  qtyReq: string;
  uom: string;
  purpose: string;
  materialGroup: string;
  materialType: string;
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

// mr approval form values
export interface FormValues {
  qtyReq: string;
  qtyApproved: string;
}
