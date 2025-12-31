import {
  materialRateSchema,
  MaterialRateValues,
} from "@/app/mrm/components/mr-request-forms/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "./current-profile";

type MaterialRequestRow = {
  id: string;
  req_id: string;
  sr_no: number;
  material_code: string;
  description: string;
  material_group: string | null;
  material_type: string | null;
  qty_req: number;
  qty_approved: number | null;
  qty_issued: number | null;
  uom: string;
  purpose: string;
  status: string;
  created_by: string | null;
  created_at: string | null;
  approved_by: string | null;
  approval_date: string | null;
  rejected_by: string | null;
  rejected_date: string | null;
  reject_reason: string | null;
  plant: string | null;
  department: string | null;
  role: string | null;
};

export async function getMaterialRequest(): Promise<MaterialRateValues[]> {
  const loggedUser = await getCurrentProfile();
  if (!loggedUser) return [];

  const supabase = await createSupabaseServerClient();

  const role = loggedUser.role?.toLowerCase();
  const plant = loggedUser.plant;

  if (!plant) {
    console.warn("User has no plant assigned");
    return [];
  }

  let query = supabase
    .from("material_requests")
    .select<string, MaterialRequestRow>(
      `
      id,
      req_id,
      sr_no,
      material_code,
      description,
      material_group,
      material_type,
      qty_req,
      qty_approved,
      qty_issued,
      uom,
      purpose,
      status,
      created_by,
      created_at,
      approved_by,
      approval_date,
      rejected_by,
      rejected_date,
      reject_reason,
      department,
      plant,
      role
      `,
    )
    .order("created_at", { ascending: false });

  if (role === "user") {
    query = query.eq("created_by", loggedUser.email).eq("plant", plant);
  } else if (role === "hod" || role === "store") {
    query = query.eq("plant", plant);
  } else if (role === "admin") {
  }

  const { data, error } = await query;

  if (error) {
    console.error("Material Request fetch failed:", error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) return [];

  return data
    .map((u) => {
      const parsed = materialRateSchema.safeParse({
        reqId: u.req_id,
        srNo: String(u.sr_no),
        materialCode: u.material_code,
        description: u.description,
        qtyReq: u.qty_req,
        uom: u.uom,
        purpose: u.purpose,
        status: u.status,
        materialGroup: u.material_group ?? undefined,
        materialType: u.material_type ?? undefined,
        qtyApproved: u.qty_approved ?? undefined,
        createdDate: u.created_at ?? undefined,
        approvalDate: u.approval_date ?? undefined,
        createdBy: u.created_by ?? undefined,
        approvedBy: u.approved_by ?? undefined,
        rejectedDate: u.rejected_date ?? undefined,
        rejectedBy: u.rejected_by ?? undefined,
        rejectReason: u.reject_reason ?? undefined,
        department: u.department ?? undefined,
        plant: u.plant ?? undefined,
        role: u.role ?? undefined,
      });

      return parsed.success ? parsed.data : null;
    })
    .filter(Boolean) as MaterialRateValues[];
}
