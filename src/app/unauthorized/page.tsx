import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 px-4">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Access Denied
          </CardTitle>
          <CardDescription className="text-base pt-2">
            You don't have the required permissions to perform this action or
            view this content.
          </CardDescription>
        </CardHeader>

        <div className="px-6 py-2">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              <strong>Required Roles:</strong> Admin or HOD
            </p>
            <p className="mt-1">
              If you believe this is an error, please contact your system
              administrator.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
