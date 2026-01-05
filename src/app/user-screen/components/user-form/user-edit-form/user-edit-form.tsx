"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { formSchema } from "../../schema";
import * as z from "zod";
import { departmentConst, plantConst, roleConst } from "../../constants";
import { Switch } from "@/components/ui/switch";
import { Pencil } from "lucide-react";
import { useActionState, useEffect } from "react";
import { updateProfileAction } from "./action";

type UserEditFormProps = {
  userData: z.infer<typeof formSchema>;
};

export default function UserEditForm({ userData }: UserEditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: userData,
  });

  useEffect(() => {
    form.reset(userData);
  }, [userData, form]);

  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    null,
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success("User Updated");
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="size-8 rounded-full" variant="outline" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="
          w-full max-w-md
          mx-auto

          bottom-0 sm:top-1/2
          sm:-translate-y-1/2

          max-h-[90dvh]
          overflow-y-auto

          px-3 py-4
        "
      >
        <DialogHeader>
          <DialogTitle className="text-left">Edit User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <input
              type="hidden"
              name="authUserId"
              value={userData.authUserId}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email ID" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Name */}
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Employee Code */}
            <FormField
              control={form.control}
              name="empCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Employee Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department & Plant */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentConst.map((d) => (
                              <SelectItem value={d} key={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          type="hidden"
                          name="department"
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
                name="plant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plant</FormLabel>
                    <FormControl>
                      <div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Plant" />
                          </SelectTrigger>
                          <SelectContent>
                            {plantConst.map((p) => (
                              <SelectItem value={p} key={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          type="hidden"
                          name="plant"
                          value={field.value ?? ""}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Role & Status */}
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <div>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roleConst.map((r) => (
                              <SelectItem value={r} key={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <input
                          type="hidden"
                          name="role"
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="w-2/4">
                    <FormControl>
                      <div className="flex items-center gap-2 pt-5">
                        <FormLabel>IsActive</FormLabel>

                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />

                        <input
                          type="hidden"
                          name="isActive"
                          value={field.value ? "true" : "false"}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="md:w-40">
                Save
              </Button>
              <DialogClose asChild>
                <Button className="md:w-40" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
