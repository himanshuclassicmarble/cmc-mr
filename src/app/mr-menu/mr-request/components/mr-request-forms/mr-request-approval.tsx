"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormValues, MRRequestApprovalProps } from "./types";

export const MRRequestApproval = ({
  data,
  onUpdate,
}: MRRequestApprovalProps) => {
  const form = useForm<FormValues>({
    defaultValues: {
      qtyReq: data.qtyReq?.toString() || "",
      qtyApproved: data.qtyReq?.toString() || "",
    },
    mode: "onSubmit",
  });

  const status: string = data.status || "pending";
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

  const handleApprove = (values: FormValues) => {
    onUpdate(data.reqId, data.srNo, {
      qtyReq: values.qtyReq,
      qtyApproved: values.qtyApproved,
      status: "approved",
    });
  };

  const handleReject = () => {
    onUpdate(data.reqId, data.srNo, { status: "rejected" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge
          className={`w-28 px-2 py-1 rounded-full text-xs font-medium uppercase cursor-pointer ${statusColor}`}
        >
          {status}
        </Badge>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Material Request Details</DialogTitle>
        </DialogHeader>

        {/* Material Details */}
        <div className="space-y-3 py-2 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">
              Request ID:
            </span>
            <span className="col-span-2">{data.reqId}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">SR No:</span>
            <span className="col-span-2">{data.srNo}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">
              Material Code:
            </span>
            <span className="col-span-2">{data.materialCode}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">
              Description:
            </span>
            <span className="col-span-2">{data.description}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="font-medium text-muted-foreground">Purpose:</span>
            <span className="col-span-2">{data.purpose}</span>
          </div>
        </div>

        {/* Editable Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApprove)}
            className="space-y-4"
          >
            <div className="flex flex-row gap-2">
              {/* Quantity Requested */}
              <FormField
                control={form.control}
                name="qtyReq"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantity Requested</FormLabel>
                    <FormControl>
                      <Input type="string" {...field} readOnly disabled />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Quantity Approved */}
              <FormField
                control={form.control}
                name="qtyApproved"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Quantity Approved</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Dialog Footer Buttons */}
            <DialogFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4">
              <Button type="submit" variant="default" className="w-full">
                Approve
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleReject}
                className="w-full"
              >
                Reject
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
