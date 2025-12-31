import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MaterialRateValues } from "./schema";

const supabase = await createSupabaseServerClient();

const { data, error } = await supabase.from("material_requests").select(
  `
    id,
    req_id,
    sr_no,
  `,
);

if (error) {
  console.error("Failed to fetch Material Request:", error.message);
  throw new Error("Failed to load Material Requests");
}
export const generateRequestId = (): string => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, "")
    .slice(0, 14);
  return `MR${timestamp}`;
};

export const renumberItems = (
  itemsList: MaterialRateValues[],
): MaterialRateValues[] => {
  return itemsList.map((item, index) => ({
    ...item,
    srNo: String((index + 1) * 10),
  }));
};
