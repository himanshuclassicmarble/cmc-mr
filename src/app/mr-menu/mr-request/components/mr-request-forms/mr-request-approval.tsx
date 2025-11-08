"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormValues, MRRequestApprovalProps } from "./types";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

export const MRRequestApproval = ({
  data,
  onUpdate,
}: MRRequestApprovalProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);

  const APPROVED_BY = "Himanshu";

  const form = useForm<FormValues>({
    defaultValues: {
      qtyReq: data.qtyReq ?? 0,
      qtyApproved: data.qtyReq ?? 0,
    },
    mode: "onSubmit",
  });

  const status = data.status || "pending";

  const statusColor =
    status === "approved"
      ? "bg-green-600 text-green-50 hover:bg-green-700"
      : status === "pending"
        ? "bg-yellow-600 text-yellow-50 hover:bg-yellow-700"
        : status === "rejected"
          ? "bg-red-600 text-yellow-50 hover:bg-red-700"
          : status === "Partially Open"
            ? "bg-blue-800 text-blue-50 hover:bg-blue-900"
            : status === "Open"
              ? "bg-green-800 text-green-50 hover:bg-green-900"
              : "bg-gray-500 text-gray-50 hover:bg-gray-600";

  // ========================= APPROVE HANDLER =========================
  const handleApprove = (values: FormValues) => {
    const approvalDate = new Date().toLocaleDateString("en-GB");

    const approvalData = {
      reqId: data.reqId,
      srNo: data.srNo,
      qtyReq: values.qtyReq,
      qtyApproved: values.qtyApproved,
      status: "approved",
      approvalDate,
      approvedBy: APPROVED_BY,
      materialCode: data.materialCode,
      description: data.description,
      purpose: data.purpose,
    };

    console.log("Approval Data:", approvalData);

    onUpdate(data.reqId, data.srNo, {
      qtyReq: values.qtyReq,
      qtyApproved: values.qtyApproved,
      status: "approved",
      approvalDate,
      approvedBy: APPROVED_BY,
    });

    setIsMainDialogOpen(false);
  };

  const handleRejectConfirm = () => {
    const rejectedDate = new Date().toISOString();
    const REJECTED_BY = "Himanshu";

    const rejectionData = {
      reqId: data.reqId,
      srNo: data.srNo,
      materialCode: data.materialCode,
      description: data.description,
      purpose: data.purpose,
      qtyReq: data.qtyReq,
      status: "rejected",
      rejectedDate,
      rejectReason,
      rejectedBy: REJECTED_BY,
    };

    console.log("Rejection Data:", rejectionData);

    onUpdate(data.reqId, data.srNo, {
      status: "rejected",
      rejectedDate,
      rejectReason,
      rejectedBy: REJECTED_BY,
    });

    setIsRejectDialogOpen(false);
    setIsMainDialogOpen(false);
    setRejectReason("");
  };

  return (
    <>
      <Drawer open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DrawerTrigger asChild>
          <Badge
            className={`w-28 px-2 py-1 rounded-full text-xs font-medium uppercase cursor-pointer ${statusColor}`}
          >
            {status}
          </Badge>
        </DrawerTrigger>

        <DrawerContent className="lg:w-4xl justify-self-center">
          <DrawerHeader>
            <DrawerTitle>Material Request Details</DrawerTitle>
          </DrawerHeader>
          <Separator orientation="horizontal" className="m-2" />

          {/* Material Details */}
          <div className="space-y-3 py-2 text-sm px-4">
            {[
              ["Request ID:", data.reqId],
              ["SR No:", data.srNo],
              ["Material Code:", data.materialCode],
              ["Description:", data.description],
              ["Purpose:", data.purpose],
              ["Requested By:", data.createdBy],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-3 gap-2">
                <span className="font-medium text-muted-foreground">
                  {label}
                </span>
                <span className="col-span-2">{value}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleApprove)}
              className="space-y-4 px-4 pb-4"
            >
              <div className="flex flex-row gap-2">
                {/* Quantity Fields */}
                <FormField
                  control={form.control}
                  name="qtyReq"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity Requested</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} readOnly disabled />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qtyApproved"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Quantity Approved</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : e.target.valueAsNumber,
                            )
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Footer Buttons */}
              <DrawerFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
                <Button type="submit" className="w-full">
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsRejectDialogOpen(true)}
                  className="w-full"
                >
                  Reject
                </Button>
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>

      {/* REJECT DIALOG */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Material Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this material request? Please
              provide a reason for rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <label
              htmlFor="reject-reason"
              className="text-sm font-medium leading-none"
            >
              Reason for Rejection
            </label>
            <Textarea
              id="reject-reason"
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
