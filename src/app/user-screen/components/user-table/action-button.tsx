"use client";

import { useEffect, useTransition, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import UserEditForm from "../user-form/user-edit-form/user-edit-form";
import { Trash } from "lucide-react";
import z from "zod";
import { formSchema } from "../schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useActionState } from "react";
import { resetUserPasswordByAdmin } from "./action";

type UserEditFormProps = {
  userData: z.infer<typeof formSchema>;
};

export default function ActionButton({ userData }: UserEditFormProps) {
  const [isPending, startTransition] = useTransition();

  const [resetState, resetAction] = useActionState(
    () => resetUserPasswordByAdmin(userData.authUserId),
    null,
  );

  useEffect(() => {
    if (resetState?.success) {
      if (resetState.warning) {
        toast.warning("Password Reset", { description: resetState.warning });
      } else {
        toast.success("Success", { description: resetState.message });
      }
    } else if (resetState?.error) {
      toast.error("Error", { description: resetState.error });
    }
  }, [resetState]);

  return (
    <div className="flex flex-row justify-end items-center gap-2">
      <UserEditForm userData={userData} />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" className="rounded-full">
            Reset
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset password?</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new password for <b>{userData.userName}</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => startTransition(() => resetAction())}
            >
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
