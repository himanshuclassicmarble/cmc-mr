import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ REQUIRED

// -------------------- helpers --------------------

function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split(".").pop();
  const map: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
  };
  return map[ext || ""] || "application/octet-stream";
}

function getFileExtension(file: any) {
  if (file?.name) return file.name.split(".").pop();
  return "pdf";
}

async function uploadFile(
  supabase: any,
  token: string,
  file: any,
  fileName: string,
): Promise<{ path: string; publicUrl: string }> {
  let buffer: Buffer;

  if (typeof file === "string") {
    const base64 = file.includes(",") ? file.split(",")[1] : file;
    buffer = Buffer.from(base64, "base64");
  } else if (file instanceof Blob) {
    buffer = Buffer.from(await file.arrayBuffer());
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else if (file?.data) {
    buffer = Buffer.from(file.data);
  } else {
    throw new Error("Unsupported file format");
  }

  if (!buffer.length) {
    throw new Error("Empty file buffer");
  }

  const path = `${token}/${fileName}`;

  const { error } = await supabase.storage
    .from("vendor-documents")
    .upload(path, buffer, {
      contentType: getContentType(fileName),
      upsert: true, // ✅ important
    });

  if (error) throw error;

  const { data } = supabase.storage.from("vendor-documents").getPublicUrl(path);

  return { path, publicUrl: data.publicUrl };
}

// -------------------- API --------------------

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const uploadedPaths: string[] = [];

  try {
    const body = await request.json();
    const { token, vendorData, govtData, bankData } = body;

    if (!token || !vendorData || !govtData || !bankData) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }

    // -------------------- validate token --------------------
    const { data: link, error: linkError } = await supabase
      .from("vendor_form_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !link || link.status !== "active") {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 403 },
      );
    }

    // -------------------- upload files FIRST --------------------
    const pan = govtData.panFile
      ? await uploadFile(
          supabase,
          token,
          govtData.panFile,
          `pan.${getFileExtension(govtData.panFile)}`,
        )
      : null;
    if (pan) uploadedPaths.push(pan.path);

    const tan = govtData.tanFile
      ? await uploadFile(
          supabase,
          token,
          govtData.tanFile,
          `tan.${getFileExtension(govtData.tanFile)}`,
        )
      : null;
    if (tan) uploadedPaths.push(tan.path);

    const gst = govtData.gstFile
      ? await uploadFile(
          supabase,
          token,
          govtData.gstFile,
          `gst.${getFileExtension(govtData.gstFile)}`,
        )
      : null;
    if (gst) uploadedPaths.push(gst.path);

    const msme = govtData.msmeFile
      ? await uploadFile(
          supabase,
          token,
          govtData.msmeFile,
          `msme.${getFileExtension(govtData.msmeFile)}`,
        )
      : null;
    if (msme) uploadedPaths.push(msme.path);

    const cheque = bankData.cancelledCheque
      ? await uploadFile(
          supabase,
          token,
          bankData.cancelledCheque,
          `cancelled_cheque.${getFileExtension(bankData.cancelledCheque)}`,
        )
      : null;
    if (cheque) uploadedPaths.push(cheque.path);

    // -------------------- insert submission --------------------
    const submissionData = {
      token,

      vendor_name: vendorData.name,
      constitution: vendorData.constitution,
      status: vendorData.status,
      address: vendorData.address,
      city: vendorData.city,
      district: vendorData.district,
      state: vendorData.state,
      pin: vendorData.pin,
      contact_person_name: vendorData.contactpersonname,
      designation: vendorData.designation,
      designation_other: vendorData.designationother,
      dob_doi: vendorData.dobdoi,
      mobile_no: vendorData.mobileno,
      email: vendorData.email,

      pan: govtData.pan,
      pan_file_url: pan?.publicUrl || null,
      pan_linked_aadhaar: govtData.panLinkedWithAadhaar,

      tan: govtData.tan || null,
      tan_file_url: tan?.publicUrl || null,

      gst_reg_no: govtData.gstregno || null,
      gst_file_url: gst?.publicUrl || null,

      msme_register: govtData.msmeregister,
      msme_reg_no: govtData.msmeregno || null,
      msme_file_url: msme?.publicUrl || null,

      itr_data: govtData.itr,

      account_no: bankData.accountno,
      ifsc_code: bankData.ifsccode,
      account_type: bankData.accounttype,
      bank_name: bankData.bankname,
      branch: bankData.branch,
      micr_code: bankData.digit || null,
      cancelled_cheque_url: cheque?.publicUrl || null,

      created_by_email: link.created_by_email,
      department: link.department,
      plant: link.plant,
      emp_code: link.emp_code,
    };

    const { error: insertError } = await supabase
      .from("vendor_submission")
      .insert(submissionData);

    if (insertError) throw insertError;

    await supabase
      .from("vendor_form_links")
      .update({ status: "submitted" })
      .eq("token", token);

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
    });
  } catch (error: any) {
    console.error("Submission failed, rolling back files:", error?.message);

    if (uploadedPaths.length) {
      await supabase.storage.from("vendor-documents").remove(uploadedPaths);
    }

    return NextResponse.json(
      { error: "Submission failed", details: error?.message },
      { status: 500 },
    );
  }
}
