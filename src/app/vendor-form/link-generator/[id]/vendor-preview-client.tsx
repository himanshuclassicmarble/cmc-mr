"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Building2,
  Landmark,
  ShieldCheck,
  Calendar,
  Hash,
  Briefcase,
  ExternalLink,
  Download,
} from "lucide-react";
import { VendorSubmission } from "@/lib/data/get-vendor-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import SendMail from "./send_mail";

/* ----------------------------- UI Primitives ----------------------------- */

const SectionTitle = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="px-4 py-2 bg-gradient-to-r from-primary to-primary/20 flex items-center gap-2 text-sm font-semibold">
    <Icon className="h-4 w-4 text-muted-foreground" />
    {title}
  </div>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div className="grid grid-cols-5 gap-4 py-2 border-b last:border-0">
    <span className="col-span-2 text-xs text-muted-foreground">{label}</span>
    <span className="col-span-3 text-sm font-medium truncate">
      {value || "—"}
    </span>
  </div>
);

const ComplianceRow = ({
  label,
  value,
  fileUrl,
}: {
  label: string;
  value?: string | null;
  fileUrl?: string | null;
}) => (
  <div className="grid grid-cols-12 items-center gap-2 py-2 border-b last:border-0">
    <span className="col-span-3 text-xs text-muted-foreground">{label}</span>
    <span className="col-span-5 text-sm font-medium truncate">
      {value || "—"}
    </span>

    <div className="col-span-4 flex justify-end gap-1">
      {fileUrl && (
        <>
          <Button size="sm" variant="ghost" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" />
              Preview
            </a>
          </Button>

          <Button size="sm" variant="outline" asChild>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <Download className="mr-1 h-4 w-4" />
              Download
            </a>
          </Button>
        </>
      )}
    </div>
  </div>
);

/* ---------------------------- Main Component ----------------------------- */

export default function VendorPreviewClient({
  vendor,
}: {
  vendor: VendorSubmission;
}) {
  const router = useRouter();
  const itrData = vendor.itr_data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-4 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {vendor.vendor_name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{vendor.constitution}</Badge>
            <Badge>{vendor.status}</Badge>
          </div>

          {/* Email moved below badges */}
          <p className="text-sm text-muted-foreground">{vendor.email}</p>
        </div>
        {/* Organizational Profile */}
        <section className="space-y-2">
          <SectionTitle icon={Building2} title="Organizational Profile" />
          <Separator />
          <div>
            <InfoRow label="Address" value={vendor.address} />
            <InfoRow label="City" value={vendor.city} />
            <InfoRow label="District" value={vendor.district} />
            <InfoRow label="State" value={vendor.state} />
            <InfoRow label="PIN" value={vendor.pin} />
            <InfoRow
              label="Contact Person"
              value={vendor.contact_person_name}
            />
            <InfoRow
              label="Designation"
              value={vendor.designation_other || vendor.designation}
            />
            <InfoRow label="Mobile" value={vendor.mobile_no} />
          </div>
        </section>
        {/* Banking */}
        <section className="space-y-2">
          <SectionTitle icon={Landmark} title="Banking Details" />
          <Separator />
          <div>
            <InfoRow label="Bank Name" value={vendor.bank_name} />
            <InfoRow label="Account No" value={vendor.account_no} />
            <InfoRow label="Account Type" value={vendor.account_type} />
            <InfoRow label="IFSC" value={vendor.ifsc_code} />
            <InfoRow label="MICR" value={vendor.micr_code} />
            <InfoRow label="Branch" value={vendor.branch} />
          </div>
        </section>
        {/* Compliance & Documents */}
        <section className="space-y-2">
          <SectionTitle icon={ShieldCheck} title="Compliance & Documents" />
          <Separator />
          <div>
            {vendor.pan_linked_aadhaar && (
              <div className="justify-self-start">
                <InfoRow
                  label="Is PAN linked with Aadhar Card?"
                  value={vendor.pan_linked_aadhaar}
                />
              </div>
            )}
            <ComplianceRow
              label="PAN"
              value={vendor.pan}
              fileUrl={vendor.pan_file_url}
            />
            <ComplianceRow
              label="GST"
              value={vendor.gst_reg_no}
              fileUrl={vendor.gst_file_url}
            />
            <ComplianceRow
              label="TAN"
              value={vendor.tan}
              fileUrl={vendor.tan_file_url}
            />
            {vendor.msme_reg_no && (
              <div className="justify-self-start">
                <InfoRow
                  label="Is MSME Registered ?"
                  value={vendor.msme_register}
                />
              </div>
            )}
            <ComplianceRow
              label="MSME"
              value={vendor.msme_reg_no}
              fileUrl={vendor.msme_file_url}
            />
            <ComplianceRow
              label="Cancelled Cheque"
              value="Uploaded"
              fileUrl={vendor.cancelled_cheque_url}
            />
          </div>
        </section>
        {/* ITR History */}
        {itrData.length > 0 && (
          <section className="space-y-2">
            <SectionTitle icon={Calendar} title="ITR History" />
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {itrData.map((itr: any, i: number) => (
                <div key={i} className="rounded-md border px-3 py-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{itr.year}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {new Date(itr.date).toLocaleDateString("en-IN")}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span className="truncate font-mono">{itr.ackNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <Card className="flex items-start justify-between px-4 py-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Review & Approval
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By clicking{" "}
                <span className="font-medium text-foreground">Accept</span>, you
                confirm that you have reviewed the documentation and approve
                forwarding it to the{" "}
                <span className="font-medium text-foreground">
                  Finance Departmant
                </span>
                .
              </p>
            </div>

            <SendMail />
          </Card>
        </section>
      </main>
    </div>
  );
}
