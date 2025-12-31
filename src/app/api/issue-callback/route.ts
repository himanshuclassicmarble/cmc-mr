// NOTE: NOT IN USE, WRITE AN GET API FROM TO GET THE DATA FROM API?
//
// import { NextResponse } from "next/server";
// import { createSupabaseServerClient } from "@/lib/supabase/server";

// export async function POST(req: Request) {
//   const apiKey = req.headers.get("x-api-key");
//   if (!apiKey || apiKey !== process.env.SAP_CALLBACK_API_KEY) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const body = await req.json();
//   const { request_id, issued_qty, issued_by, issued_at } = body;

//   if (!request_id || issued_qty === undefined) {
//     return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
//   }

//   const [reqId, srNoStr] = request_id.split("-");
//   const srNo = Number(srNoStr);

//   if (!reqId || Number.isNaN(srNo)) {
//     return NextResponse.json(
//       { error: "Invalid request_id format" },
//       { status: 400 },
//     );
//   }

//   const supabase = await createSupabaseServerClient();

//   const { data: rows, error: fetchError } = await supabase
//     .from("material_requests")
//     .select("qty_approved, qty_issued, status")
//     .eq("req_id", reqId)
//     .eq("sr_no", srNo)
//     .limit(1);

//   if (fetchError || !rows || rows.length === 0) {
//     return NextResponse.json({ error: "Request not found" }, { status: 404 });
//   }

//   const row = rows[0];
//   const approvedQty = row.qty_approved ?? 0;

//   let nextStatus: string;
//   if (issued_qty >= approvedQty) {
//     nextStatus = "Closed";
//   } else {
//     nextStatus = "Partially Open";
//   }

//   const { error: updateError } = await supabase
//     .from("material_requests")
//     .update({
//       qty_issued: issued_qty,
//       issued_by: issued_by ?? "SAP",
//       issued_at: issued_at
//         ? new Date(issued_at).toISOString()
//         : new Date().toISOString(),
//       status: nextStatus,
//     })
//     .eq("req_id", reqId)
//     .eq("sr_no", srNo);

//   if (updateError) {
//     console.error("DB update error:", updateError);
//     return NextResponse.json(
//       { error: "Database update failed" },
//       { status: 500 },
//     );
//   }

//   return NextResponse.json({
//     success: true,
//     status: nextStatus,
//   });
// }
