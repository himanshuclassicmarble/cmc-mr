import { notFound } from "next/navigation";
import PageWrapper from "./page-wrapper";
import { VendorFormProvider } from "@/hooks/vendorcontext";
import { getLinkByToken } from "@/lib/data/get-link-by-token";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function VendorFormPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const linkData = await getLinkByToken(token);

  // ❌ Token not found
  if (!linkData) {
    notFound();
  }

  const now = new Date();
  const expiresAt = new Date(linkData.expiresAt);

  const expired = now > expiresAt;
  const completed = linkData.status === "submitted";

  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-center">
            <div className="p-4 bg-red-50 rounded-full">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Link Expired
            </h2>
            <p className="text-muted-foreground">
              This invitation link has reached its expiration date and is no
              longer valid. Please contact the administrator for a new link.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-2">
            <Button asChild variant="default">
              <Link href="/">Return Home</Link>
            </Button>
            <Button variant="ghost" className="gap-2">
              <Mail className="h-4 w-4" /> Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-center">
            <div className="p-4 bg-amber-50 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Submission Received
            </h2>
            <p className="text-muted-foreground">
              It looks like you have already completed and submitted this form.
              No further action is required at this time.
            </p>
          </div>
          <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <VendorFormProvider>
      <PageWrapper
        token={token}
        linkData={{
          createdBy: linkData.createdByEmail,
          department: linkData.department,
          plant: linkData.plant,
          empCode: linkData.empCode,
        }}
      />
    </VendorFormProvider>
  );
}
