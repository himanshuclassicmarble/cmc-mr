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
  FormMessage,
} from "@/components/ui/form";
import { FormValues, MRRequestApprovalProps } from "../types";
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
import { toast } from "sonner";
import { updateMRApprovalAction } from "./action";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";

export const MRRequestApproval = ({
  data,
  isAuthorised,
  isDisabled,
}: MRRequestApprovalProps) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

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
          ? "bg-red-600 text-red-50 hover:bg-red-700"
          : status === "Partially Open"
            ? "bg-blue-800 text-blue-50 hover:bg-blue-900"
            : status === "Open"
              ? "bg-green-800 text-green-50 hover:bg-green-900"
              : "bg-gray-500 text-gray-50 hover:bg-gray-600";

  const handleBadgeClick = (e: React.MouseEvent) => {
    if (!isAuthorised) {
      e.preventDefault();
      e.stopPropagation();
      toast.error("You're not authorised. Only HOD or Admin can approve.");
    }
  };

  const handleDrawerClose = () => {
    if (!isApproving && !isRejecting) {
      form.reset({
        qtyReq: data.qtyReq ?? 0,
        qtyApproved: data.qtyReq ?? 0,
      });
      setIsMainDialogOpen(false);
    }
  };

  const handleApprove = async (values: FormValues) => {
    if (!isAuthorised) {
      toast.error("You are not authorised. Only HOD or Admin can approve.");
      return;
    }

    if (isApproving) return;

    // Validation
    if (!values.qtyApproved || values.qtyApproved <= 0) {
      toast.error("Please enter a valid quantity to approve");
      return;
    }

    if (values.qtyApproved > values.qtyReq) {
      toast.error("Approved quantity cannot exceed requested quantity");
      return;
    }

    setIsApproving(true);

    try {
      const approvalDate = new Date().toISOString();
      const formData = new FormData();
      formData.append("reqId", data.reqId);
      formData.append("srNo", data.srNo.toString());
      formData.append("status", "approved");
      formData.append("qtyReq", values.qtyReq.toString());
      formData.append("qtyApproved", values.qtyApproved?.toString() ?? "");
      formData.append("approvalDate", approvalDate);

      const res = await updateMRApprovalAction(null, formData);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Material request approved successfully");
      form.reset();
      setIsMainDialogOpen(false);
    } catch (error) {
      toast.error("Failed to approve request. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectClick = () => {
    if (!isAuthorised) {
      toast.error("You are not authorised. Only HOD or Admin can reject.");
      return;
    }
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!isAuthorised) return;
    if (isRejecting) return;

    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsRejecting(true);

    try {
      const rejectedDate = new Date().toISOString();
      const formData = new FormData();
      formData.append("reqId", data.reqId);
      formData.append("srNo", data.srNo.toString());
      formData.append("status", "rejected");
      formData.append("rejectedDate", rejectedDate);
      formData.append("rejectReason", rejectReason);

      const res = await updateMRApprovalAction(null, formData);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success("Material request rejected successfully");
      setIsRejectDialogOpen(false);
      setIsMainDialogOpen(false);
      setRejectReason("");
      form.reset();
    } catch (error) {
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleRejectCancel = () => {
    if (!isRejecting) {
      setRejectReason("");
      setIsRejectDialogOpen(false);
    }
  };

  const qtyReq = form.watch("qtyReq") ?? 0;
  const isSubmitting = isApproving || isRejecting;

  return (
    <>
      <Drawer open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DrawerTrigger
          asChild
          onClick={handleBadgeClick}
          disabled={isDisabled || !isAuthorised || isSubmitting}
          className="disabled:cursor-not-allowed"
        >
          <Badge
            className={`w-28 px-2 py-1 rounded-full text-xs font-medium uppercase ${
              isDisabled || !isAuthorised || isSubmitting
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            } ${statusColor}`}
          >
            {status}
          </Badge>
        </DrawerTrigger>
        {isAuthorised && (
          <DrawerContent className="w-full mx-auto px-3 py-4">
            <ScrollArea
              className="
                h-[500px]
                landscape:h-[300px]
                sm:h-[500px]
                md:h-[500px]
              "
            >
              <DrawerHeader>
                <DrawerTitle>Material Request Details</DrawerTitle>
              </DrawerHeader>
              <Separator orientation="horizontal" className="m-2" />

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

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleApprove)}
                  className="space-y-4 px-4 pb-4"
                >
                  <div className="flex flex-row gap-2">
                    <FormField
                      control={form.control}
                      name="qtyReq"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Quantity Requested</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              readOnly
                              disabled
                              className="bg-muted"
                            />
                          </FormControl>
                          <FormMessage />
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
                              min={0}
                              max={qtyReq}
                              disabled={!isAuthorised || isSubmitting}
                              placeholder="Enter quantity"
                              value={field.value ?? 0}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? null
                                    : e.target.valueAsNumber;

                                if (value === null) {
                                  field.onChange(null);
                                  return;
                                }

                                if (value > qtyReq) {
                                  field.onChange(qtyReq);
                                  toast.error(
                                    "Approved quantity cannot exceed requested quantity",
                                  );
                                } else if (value < 0) {
                                  field.onChange(0);
                                } else {
                                  field.onChange(value);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <DrawerFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={!isAuthorised || isSubmitting}
                    >
                      {isApproving ? (
                        <>
                          <Spinner />
                          Approving…
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRejectClick}
                      className="w-full"
                      disabled={!isAuthorised || isSubmitting}
                    >
                      Reject
                    </Button>
                    <DrawerClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleDrawerClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </form>
              </Form>
            </ScrollArea>
          </DrawerContent>
        )}
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
              Reason for Rejection *
            </label>
            <Textarea
              id="reject-reason"
              placeholder="Enter reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-2 min-h-[100px]"
              disabled={isRejecting}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleRejectCancel}
              disabled={isRejecting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? (
                <>
                  <Spinner />
                  Rejecting…
                </>
              ) : (
                "Confirm Rejection"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
