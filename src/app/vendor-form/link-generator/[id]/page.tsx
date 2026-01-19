// app/vendor-preview/[id]/page.tsx
import { getVendorFormByToken } from "@/lib/data/get-vendor-form";
import { notFound } from "next/navigation";
import VendorPreviewClient from "./vendor-preview-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorPreviewPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch vendor data by matching id with token
  const vendor = await getVendorFormByToken(id);

  // If vendor not found, show 404
  if (!vendor) {
    notFound();
  }

  // Pass data to client component
  return <VendorPreviewClient vendor={vendor} />;
}
