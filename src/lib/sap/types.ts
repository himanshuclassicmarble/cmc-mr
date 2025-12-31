export interface MaterialRequestForSAP {
  request_id?: string;
  req_id: string;
  sr_no: number;
  material_code: string;
  description: string;
  material_group: string | null;
  material_type: string | null;
  qty_req: number;
  qty_approved: number;
  uom: string;
  purpose: string;
  approved_by: string;
  approval_date: string;
  status?: string;
}

export interface SAPResponse {
  success: boolean;
  request_id: string;
  issued_qty?: number;
  issued_by?: string;
  issued_at?: string;
  sap_issue_no?: string;
  error?: string;
}
