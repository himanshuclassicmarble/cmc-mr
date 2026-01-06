"use client";
import React, { useActionState, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { buomConst, materialGroupConst, materialTypeConst } from "../constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { formSchema, MRMasterSchema } from "../schema";
import { createMatMasterAction } from "./action";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MRCreateForm() {
  const [open, setOpen] = useState(false);

  const form = useForm<MRMasterSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCode: "",
      materialType: undefined,
      materialGroup: undefined,
      uom: undefined,
      materialDescription: "",
    },
  });

  const [state, formAction, pending] = useActionState(
    createMatMasterAction,
    null,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success("Material created successfully");
      form.reset();
      setOpen(false);
    }
  }, [state, form]);

  const handleDialogClose = () => {
    form.reset();
    setOpen(false);
  };

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) {
      toast.error("Please fix validation errors");
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Material</Button>
      </DialogTrigger>
      <DialogContent className="w-full mx-auto px-3 py-4">
        <DialogHeader>
          <DialogTitle>Create New Material</DialogTitle>
        </DialogHeader>

        <ScrollArea className="rounded-none px-4">
          <Form {...form}>
            <form action={formAction} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="materialCode"
                  render={({ field }) => (
                    <FormItem className="md:w-3/4">
                      <FormLabel>Material Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter material code"
                          type="number"
                          disabled={pending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="materialType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={pending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialTypeConst.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <input
                            type="hidden"
                            name="materialType"
                            value={field.value ?? ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="materialGroup"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Group</FormLabel>
                      <FormControl>
                        <div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={pending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                              {materialGroupConst.map((group) => (
                                <SelectItem key={group} value={group}>
                                  {group}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <input
                            type="hidden"
                            name="materialGroup"
                            value={field.value ?? ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="uom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Unit (UOM)</FormLabel>
                      <FormControl>
                        <div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                            disabled={pending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {buomConst.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <input
                            type="hidden"
                            name="uom"
                            value={field.value ?? ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="materialDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter material description"
                        disabled={pending}
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-2 flex flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    disabled={pending}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  disabled={pending}
                  className="gap-2"
                  onClick={handleSubmit}
                >
                  {pending ? (
                    <>
                      <Spinner />
                      Creating…
                    </>
                  ) : (
                    "Create Material"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
