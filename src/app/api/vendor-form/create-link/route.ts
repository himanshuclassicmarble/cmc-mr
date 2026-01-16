import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import crypto from "crypto";

interface CreateLinkBody {
  email: string;
  department: string;
  plant: string;
  empCode: string;
}

export async function POST(req: Request) {
  try {
    // Parse request body
    const body: CreateLinkBody = await req.json();
    const { email, department, plant, empCode } = body;

    // Validate required fields
    if (!email || !department || !plant || !empCode) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: email, department, plant, and empCode are required",
        },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Create Supabase client
    const supabase = await createSupabaseServerClient();

    // Generate unique token
    const token = crypto.randomUUID();

    // Set expiration to 7 days from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Insert new link
    const { data, error } = await supabase
      .from("vendor_form_links")
      .insert({
        token,
        created_by_email: email,
        department,
        plant,
        emp_code: empCode,
        expires_at: expiresAt.toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);

      // Handle specific database errors
      if (error.code === "23505") {
        // Unique violation - retry with new token
        const newToken = crypto.randomUUID();
        const retryResult = await supabase
          .from("vendor_form_links")
          .insert({
            token: newToken,
            created_by_email: email,
            department,
            plant,
            emp_code: empCode,
            expires_at: expiresAt.toISOString(),
            status: "active",
          })
          .select()
          .single();

        if (retryResult.error) {
          return NextResponse.json(
            { error: "Failed to create link. Please try again." },
            { status: 500 },
          );
        }

        // Construct the full URL with new token
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const link = `${baseUrl}/vendor-form/${newToken}`;

        return NextResponse.json(
          {
            success: true,
            link,
            token: newToken,
            expiresAt: expiresAt.toISOString(),
          },
          { status: 201 },
        );
      }

      return NextResponse.json(
        { error: "Failed to create link. Please try again." },
        { status: 500 },
      );
    }

    // Construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${baseUrl}/vendor-form/${token}`;

    return NextResponse.json(
      {
        success: true,
        link,
        token,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Unexpected error in create-link:", err);

    // Handle JSON parsing errors
    if (err instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
