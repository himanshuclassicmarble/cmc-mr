"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Copy, Check, Loader2 } from "lucide-react";
import type { UserFormSchema } from "@/app/user-screen/components/schema";
import { toast } from "sonner";

interface Props {
  user: UserFormSchema;
}

const CreateLinkButton = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");

  const handleCreateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/vendor-form/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          department: user.department,
          plant: user.plant,
          empCode: user.empCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create link");
      }

      const data = await response.json();
      setGeneratedLink(data.link);
      setOpen(true);

      toast.success("Vendor form link created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create link",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2"
        onClick={handleCreateLink}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Create New Form Link
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Form Link Generated</DialogTitle>
            <DialogDescription>
              Share this link with your vendor to collect their information.
              Link expires in 7 days.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                readOnly
                value={generatedLink}
                className="font-mono text-sm"
              />
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateLinkButton;
