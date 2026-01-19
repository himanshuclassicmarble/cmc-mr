import { createSupabaseServerClient } from "../supabase/server";

/**
 * Represents a vendor form submission record
 */
export interface VendorSubmission {
  token: string;
  vendor_name: string;
  constitution: string;
  status: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  contact_person_name: string;
  designation: string;
  designation_other: string | null;
  dob_doi: string;
  mobile_no: string;
  email: string;
  pan: string;
  pan_file_url: string | null;
  pan_linked_aadhaar: string;
  tan: string;
  tan_file_url: string | null;
  gst_reg_no: string;
  gst_file_url: string | null;
  msme_register: string;
  msme_reg_no: string | null;
  msme_file_url: string | null;
  itr_data: any[]; // Array of ITR records
  account_no: string;
  ifsc_code: string;
  account_type: string;
  bank_name: string;
  branch: string;
  micr_code: string;
  cancelled_cheque_url: string | null;
  created_by_email: string;
  department: string;
  plant: string;
  emp_code: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Normalizes ITR data to always return an array
 */
function normalizeItrData(itr_data: unknown): any[] {
  if (Array.isArray(itr_data)) {
    return itr_data;
  }
  if (typeof itr_data === "string") {
    try {
      const parsed = JSON.parse(itr_data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Common column selection to avoid duplication bugs
 */
const vendorSubmissionSelect = `
  token,
  vendor_name,
  constitution,
  status,
  address,
  city,
  district,
  state,
  pin,
  contact_person_name,
  designation,
  designation_other,
  dob_doi,
  mobile_no,
  email,
  pan,
  pan_file_url,
  pan_linked_aadhaar,
  tan,
  tan_file_url,
  gst_reg_no,
  gst_file_url,
  msme_register,
  msme_reg_no,
  msme_file_url,
  itr_data,
  account_no,
  ifsc_code,
  account_type,
  bank_name,
  branch,
  micr_code,
  cancelled_cheque_url,
  created_by_email,
  department,
  plant,
  emp_code,
  submitted_at,
  created_at,
  updated_at
`;

/**
 * Normalizes vendor submission data
 */
function normalizeVendorSubmission(data: any): VendorSubmission {
  return {
    ...data,
    itr_data: normalizeItrData(data.itr_data),
  };
}

/**
 * Fetch all vendor form submissions
 */
export async function getVendorForm(): Promise<VendorSubmission[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vendor_submission")
    .select(vendorSubmissionSelect)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch vendor submissions:", error.message);
    throw new Error("Failed to load vendor submissions");
  }

  if (!data) return [];

  return data.map(normalizeVendorSubmission);
}

/**
 * Fetch a single vendor submission by token
 */
export async function getVendorFormByToken(
  token: string,
): Promise<VendorSubmission | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vendor_submission")
    .select(vendorSubmissionSelect)
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch vendor submission:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeVendorSubmission(data);
}

/**
 * Fetch vendor submissions by creator email
 */
export async function getVendorFormByEmail(
  email: string,
): Promise<VendorSubmission[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vendor_submission")
    .select(vendorSubmissionSelect)
    .eq("created_by_email", email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch vendor submissions:", error.message);
    throw new Error("Failed to load vendor submissions");
  }

  if (!data) return [];

  return data.map(normalizeVendorSubmission);
}
