"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Eye, Share2, Trash2 } from "lucide-react";
import { LinkSchemaType } from "../schema/schema";
import { Separator } from "@/components/ui/separator";
import { Value } from "@radix-ui/react-select";

const CopyLinkCell = ({ token }: { token: string }) => {
  const [copied, setCopied] = useState(false);
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/vendor-form/${token}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <Input
        type="text"
        value={link}
        readOnly
        className="h-8 text-xs bg-muted/30 focus-visible:ring-0"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export const linkColumns: ColumnDef<LinkSchemaType>[] = [
  {
    accessorKey: "createdByEmail",
    header: "Created By",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.createdByEmail}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "active" ? "default" : "secondary"}
          className="capitalize"
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "link",
    header: "Link",
    cell: ({ row }) => <CopyLinkCell token={row.original.token} />,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Actions</div>,
    cell: ({ row }) => {
      const id = row.original.token;

      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 px-2 py-1 border rounded-lg bg-muted/20 shadow-sm">
            {/* View Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-background hover:text-blue-600 transition-colors"
              onClick={() => console.log("View", id)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-background hover:text-green-600 transition-colors"
              onClick={() => console.log("Share", id)}
              title="Share Link"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-4 mx-1" />

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all"
              onClick={() => console.log("Delete", id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    },
  },
];
