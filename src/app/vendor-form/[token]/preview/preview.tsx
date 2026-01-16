"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  ShieldCheck,
  Landmark,
  CheckCircle2,
  ArrowLeft,
  FileText,
  User,
  Paperclip,
  Download,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useVendorForm } from "@/hooks/vendorcontext";

type PreviewProps = {
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export default function Preview({
  onPrev,
  onSubmit,
  isSubmitting = false,
}: PreviewProps) {
  const { vendor, govtForm, bankDetails } = useVendorForm();

  if (!vendor || !govtForm || !bankDetails) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Missing Information</h3>
        <p className="text-muted-foreground">
          Please complete all previous steps to view the summary.
        </p>
        <Button variant="link" onClick={onPrev} className="mt-2">
          Return to form
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6">
      {/* Header Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Review Application
          </h2>
          <p className="text-muted-foreground mt-1">
            Please verify all details before final submission.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Form Completed
          </span>
        </div>
      </div>

      {/* ---------------- Vendor Details ---------------- */}
      <Section title="Vendor Profile" icon={<Building2 className="w-5 h-5" />}>
        <div className="grid md:grid-cols-3 gap-y-6 gap-x-8">
          <DataBlock label="Legal Entity Name" value={vendor.name} />
          <DataBlock
            label="Constitution"
            value={
              <Badge variant="secondary" className="font-semibold">
                {vendor.constitution}
              </Badge>
            }
          />
          <DataBlock label="Business Status" value={vendor.status} />

          <div className="md:col-span-3">
            <DataBlock
              label="Registered Address"
              value={`${vendor.address}, ${vendor.city}, ${vendor.district}, ${vendor.state} - ${vendor.pin}`}
            />
          </div>

          <DataBlock
            label="Contact Person"
            value={
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 text-muted-foreground" />
                {vendor.contactpersonname}
              </div>
            }
          />
          <DataBlock
            label="Designation"
            value={
              vendor.designation === "Other"
                ? vendor.designationother
                : vendor.designation
            }
          />
          <DataBlock
            label="Date of Inc./Birth"
            value={new Date(vendor.dobdoi).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />

          <DataBlock label="Primary Mobile" value={`+91 ${vendor.mobileno}`} />
          <div className="md:col-span-2">
            <DataBlock label="Email Address" value={vendor.email} />
          </div>
        </div>
      </Section>

      {/* ---------------- Govt Compliances ---------------- */}
      <Section
        title="Regulatory Compliance"
        icon={<ShieldCheck className="w-5 h-5" />}
      >
        <div className="space-y-6">
          {/* Tax Documents */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tax Identification
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <DocumentCard
                label="PAN Number"
                value={govtForm.pan}
                file={govtForm.panFile}
                badge={
                  govtForm.panLinkedWithAadhaar === "Yes"
                    ? "Aadhaar Linked"
                    : "Not Linked"
                }
                badgeVariant={
                  govtForm.panLinkedWithAadhaar === "Yes"
                    ? "success"
                    : "secondary"
                }
              />

              {govtForm.tan && (
                <DocumentCard
                  label="TAN Number"
                  value={govtForm.tan}
                  file={govtForm.tanFile}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {govtForm.gstregno && (
                <DocumentCard
                  label="GST Registration"
                  value={govtForm.gstregno}
                  file={govtForm.gstFile}
                />
              )}

              <DocumentCard
                label="MSME Status"
                value={
                  govtForm.msmeregister === "Yes"
                    ? govtForm.msmeregno || "Registered"
                    : "Not Registered"
                }
                file={
                  govtForm.msmeregister === "Yes"
                    ? govtForm.msmeFile
                    : undefined
                }
                badge={
                  govtForm.msmeregister === "Yes" ? "MSME Certified" : undefined
                }
                badgeVariant="secondary"
              />
            </div>
          </div>

          <Separator />

          {/* ITR Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Income Tax Return History
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {govtForm.itr.map((itr) => (
                <div
                  key={itr.year}
                  className="flex flex-col gap-3 p-4 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 border border-muted-foreground/20"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2 font-bold">
                        {itr.year}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        Acknowledgement No.
                      </p>
                      <p className="text-sm font-mono font-semibold">
                        {itr.ackNo || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Filing Date
                      </p>
                      <p className="text-sm font-semibold">
                        {itr.date
                          ? new Date(itr.date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Documents Summary */}
          <div className="mt-6 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900">
                  Documents Submitted
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {govtForm.panFile && (
                    <FileBadge name={govtForm.panFile.name || "PAN Document"} />
                  )}
                  {govtForm.tanFile && (
                    <FileBadge name={govtForm.tanFile.name || "TAN Document"} />
                  )}
                  {govtForm.gstFile && (
                    <FileBadge
                      name={govtForm.gstFile.name || "GST Certificate"}
                    />
                  )}
                  {govtForm.msmeFile && (
                    <FileBadge
                      name={govtForm.msmeFile.name || "MSME Certificate"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------- Bank Details ---------------- */}
      <Section
        title="Banking Information"
        icon={<Landmark className="w-5 h-5" />}
      >
        <div className="bg-gradient-to-br from-primary/[0.03] to-primary/[0.01] border border-primary/20 rounded-xl p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DataBlock
              label="Bank Account Number"
              value={
                <span className="font-mono text-base font-bold">
                  {bankDetails.accountno}
                </span>
              }
            />
            <DataBlock
              label="IFSC Code"
              value={
                <span className="font-mono font-bold text-primary text-base">
                  {bankDetails.ifsccode}
                </span>
              }
            />
            <DataBlock
              label="Account Type"
              value={
                <Badge variant="outline" className="font-semibold">
                  {bankDetails.accounttype}
                </Badge>
              }
            />

            <div className="md:col-span-2">
              <DataBlock
                label="Bank & Branch Name"
                value={`${bankDetails.bankname} - ${bankDetails.branch}`}
              />
            </div>
            <DataBlock
              label="MICR Code"
              value={
                <span className="font-mono">{bankDetails.digit || "N/A"}</span>
              }
            />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border bg-amber-50/50 border-amber-200">
          <div className="flex items-start gap-3">
            <Paperclip className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-amber-900 uppercase tracking-wide">
                Cancelled Cheque
              </p>
              <p className="text-sm text-amber-800 font-medium mt-1">
                {bankDetails.cancelcheque?.[0]?.name || "Not Uploaded"}
              </p>
            </div>
            {bankDetails.cancelcheque?.[0] && (
              <Download className="w-4 h-4 text-amber-600" />
            )}
          </div>
        </div>
      </Section>

      {/* Declaration */}
      <div className="p-6 bg-gradient-to-r from-muted/60 to-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary mt-1" />
          <div>
            <p className="font-semibold text-sm mb-1">Declaration</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I hereby declare that the information provided above is true and
              correct to the best of my knowledge and belief. I understand that
              any false information may result in rejection of this application.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- Actions ---------------- */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isSubmitting}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Edit
        </Button>
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-12 font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- UI Helpers ---------------- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-md border-muted-foreground/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-background rounded-lg border-2 shadow-sm text-primary">
            {icon}
          </div>
          <CardTitle className="text-lg font-bold tracking-tight">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

function DataBlock({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="text-sm font-semibold text-foreground">
        {value || <span className="text-muted-foreground/50">—</span>}
      </div>
    </div>
  );
}

function DocumentCard({
  label,
  value,
  file,
  badge,
  badgeVariant = "secondary",
}: {
  label: string;
  value: string;
  file?: File;
  badge?: string;
  badgeVariant?: "success" | "secondary";
}) {
  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {badge && (
          <Badge
            variant={badgeVariant === "success" ? "default" : "secondary"}
            className={
              badgeVariant === "success" ? "bg-green-600 text-white" : ""
            }
          >
            {badge}
          </Badge>
        )}
      </div>
      <p className="font-mono font-bold text-base mb-3 uppercase">{value}</p>
      {file && (
        <div className="flex items-center gap-2 pt-3 border-t">
          <Paperclip className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-muted-foreground truncate flex-1">
            {file.name}
          </span>
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
        </div>
      )}
    </div>
  );
}

function FileBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-blue-200 rounded-md">
      <Paperclip className="w-3 h-3 text-blue-600" />
      <span className="text-xs font-medium text-blue-700 truncate max-w-[150px]">
        {name}
      </span>
    </div>
  );
}
