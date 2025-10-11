"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Delete, Edit, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserData } from "../types";
import UserEditForm from "./user-form/user-edit-form";
import { Badge } from "@/components/ui/badge";

export const userColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "userId",
    header: "UserId ",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "userName",
    header: "UserName",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("userName")}</span>
    ),
  },
  {
    accessorKey: "empCode",
    header: "Emp Code",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("empCode")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <div>{row.getValue("department")}</div>,
  },
  {
    accessorKey: "plant",
    header: "Plant",
    cell: ({ row }) => <div>{row.getValue("plant")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div>{row.getValue("role")}</div>,
  },
  {
    accessorKey: "hod",
    header: "HOD",
    cell: ({ row }) => <div>{row.getValue("hod")}</div>,
  },
  {
    accessorKey: "isActive",
    header: "IsActive",
    cell: ({ row }) => {
      const active = row.getValue("isActive") as boolean;
      return (
        <Badge
          className={`w-16 ${
            active
              ? "bg-green-600 text-secondary"
              : "bg-destructive text-secondary"
          } px-2 py-1 rounded-full text-xs`}
        >
          {active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const Action = row.original;
      return (
        <div className="flex flex-row gap-2">
          <UserEditForm />
          <Button
            className="size-8 rounded-full"
            variant="destructive"
            size="icon"
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];
