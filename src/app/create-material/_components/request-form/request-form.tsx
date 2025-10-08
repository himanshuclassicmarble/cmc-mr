"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formSchema, FormSchema } from "./schema";

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
import { Card } from "@/components/ui/card";
import { buomConst, materialGroupConst, materialTypeConst } from "./constants";

export default function RequestForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCode: "",
      materialType: undefined,
      materialGroup: undefined,
      buom: undefined,
      materialDescription: "",
    },
  });

  const handleSubmit = (values: FormSchema) => {
    console.log("Form Values:", values);
    alert("form triggered");
    form.reset({
      materialCode: "",
      materialType: undefined,
      materialGroup: undefined,
      buom: undefined,
      materialDescription: "",
    });
  };

  const handleCancel = () => {
    form.reset({
      materialCode: "",
      materialType: undefined,
      materialGroup: undefined,
      buom: undefined,
      materialDescription: "",
    });
  };

  return (
    <Card className="w-full h-full p-3 shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              name="buom"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>BUOM</FormLabel>
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

          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <Button type="submit" className="md:w-40">
              Submit
            </Button>
            <Button
              variant="outline"
              className="md:w-40"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
