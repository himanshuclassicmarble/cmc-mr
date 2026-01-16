import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await request.json();

    console.log("Received submission request for token:", body.token);

    const { token, vendorData, govtData, bankData } = body;

    // More detailed validation
    if (!token) {
      console.error("Missing token in request");
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    if (!vendorData) {
      console.error("Missing vendorData in request");
      return NextResponse.json(
        { error: "Missing vendor data" },
        { status: 400 },
      );
    }

    if (!govtData) {
      console.error("Missing govtData in request");
      return NextResponse.json(
        { error: "Missing government compliance data" },
        { status: 400 },
      );
    }

    if (!bankData) {
      console.error("Missing bankData in request");
      return NextResponse.json(
        { error: "Missing bank details" },
        { status: 400 },
      );
    }

    console.log("All data present, fetching link data...");

    // First, get the link data from vendor_form_links
    const { data: linkData, error: linkError } = await supabase
      .from("vendor_form_links")
      .select("*")
      .eq("token", token)
      .single();

    if (linkError || !linkData) {
      console.error("Link fetch error:", linkError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 404 },
      );
    }

    console.log("Link data found:", linkData);

    // Check if link is still active
    if (linkData.status !== "active") {
      console.error("Link is not active, current status:", linkData.status);
      return NextResponse.json(
        { error: "This form link is no longer active" },
        { status: 403 },
      );
    }

    // Check if already submitted
    const { data: existingSubmission } = await supabase
      .from("vendor_submission")
      .select("token")
      .eq("token", token)
      .single();

    if (existingSubmission) {
      console.error("Form already submitted for this token");
      return NextResponse.json(
        { error: "Form already submitted" },
        { status: 409 },
      );
    }

    console.log("Preparing submission data...");

    // Prepare submission data
    const submissionData = {
      token: token,

      // Vendor Details
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

      // Government Compliance
      pan: govtData.pan,
      pan_file_url: null, // Will be updated after file upload
      pan_linked_aadhaar: govtData.panLinkedWithAadhaar,
      tan: govtData.tan || null,
      tan_file_url: null,
      gst_reg_no: govtData.gstregno || null,
      gst_file_url: null,
      msme_register: govtData.msmeregister,
      msme_reg_no: govtData.msmeregno || null,
      msme_file_url: null,
      itr_data: govtData.itr, // Store as JSONB

      // Bank Details
      account_no: bankData.accountno,
      ifsc_code: bankData.ifsccode,
      account_type: bankData.accounttype,
      bank_name: bankData.bankname,
      branch: bankData.branch,
      micr_code: bankData.digit || null,
      cancelled_cheque_url: null,

      // Metadata from link
      created_by_email: linkData.created_by_email,
      department: linkData.department,
      plant: linkData.plant,
      emp_code: linkData.emp_code,
    };

    console.log("Inserting submission data...");

    // Insert into vendor_submission
    const { data: submission, error: submissionError } = await supabase
      .from("vendor_submission")
      .insert(submissionData)
      .select()
      .single();

    if (submissionError) {
      console.error("Submission error:", submissionError);
      return NextResponse.json(
        { error: "Failed to submit form", details: submissionError.message },
        { status: 500 },
      );
    }

    console.log("Submission successful, updating link status...");

    // Update vendor_form_links status to 'submitted'
    const { error: updateError } = await supabase
      .from("vendor_form_links")
      .update({ status: "submitted" })
      .eq("token", token);

    if (updateError) {
      console.error("Status update error:", updateError);
      // Don't fail the request, submission was successful
    }

    console.log("Form submission complete!");

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission.token,
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
