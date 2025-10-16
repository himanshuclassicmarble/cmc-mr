"use client";
import React from "react";
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
import { buomConst, materialGroupConst, materialTypeConst } from "./constants";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { formSchema, MRMasterSchema } from "./schema";

interface MRCreateFormProps {
  onAddData: (data: MRMasterSchema) => void;
}
export default function MRCreateForm({ onAddData }: MRCreateFormProps) {
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

  const handleSubmit = (values: MRMasterSchema) => {
    onAddData(values);

    toast.success("Form Successfully Submitted!", {
      description: "Your material request has been recorded.",
      duration: 3000,
    });

    form.reset({
      materialCode: "",
      materialType: undefined,
      materialGroup: undefined,
      uom: undefined,
      materialDescription: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create New Material</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Material</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="materialCode"
                render={({ field }) => (
                  <FormItem className="md:w-3/4">
                    <FormLabel>Material Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Material Code"
                        type="number"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Material Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialTypeConst.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Material Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialGroupConst.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <FormLabel>UOM</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {buomConst.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    <Textarea placeholder="Material Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-col md:flex-row gap-2 justify-center">
                <Button type="submit" className="md:w-40">
                  Submit
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="md:w-40" type="button">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
