"use client";
import React from "react";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  materialCode: z.int().optional(),
  materialType: z.enum(["abc", "xyz"]),
  materialGroup: z.enum(["sm", "large"]),
  buom: z.enum(["kg", "M", "L"]),
  materialDescription: z.string().min(5).max(50),
});
export default function RequestForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCode: undefined,
      materialType: undefined,
      materialGroup: undefined,
      buom: undefined,
      materialDescription: "",
    },
  });
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    alert("check in console");
  };

  return (
    <div className="px-4 py-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 md:space-y-8 "
        >
          <div className="md:flex flex-row space-y-4  md:space-y-0 gap-4">
            <FormField
              control={form.control}
              name="materialCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Material Code"
                      type="interger"
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
                <FormItem>
                  <FormLabel>Material Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Material Type " />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="abc">abc</SelectItem>
                        <SelectItem value="xyz">xyz</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:flex flex-row space-y-4 md:space-y-0 gap-4">
            <FormField
              control={form.control}
              name="materialGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Group</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Material Group " />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="sm">sm</SelectItem>
                        <SelectItem value="large">large</SelectItem>
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
                <FormItem>
                  <FormLabel>Base Unit of Measure</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Base Unit of Measure " />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="M">M</SelectItem>
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
                <FormLabel>Material Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Material Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row gap-2">
            <Button type="submit" className="flex-1 md:flex-none">
              Submit
            </Button>
            <Button variant="outline" className="flex-1 md:flex-none">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
