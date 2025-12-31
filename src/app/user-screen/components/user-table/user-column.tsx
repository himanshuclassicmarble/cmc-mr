import { ColumnDef } from "@tanstack/react-table";
import { UserFormSchema } from "../schema";
import { Badge } from "@/components/ui/badge";
import ActionButton from "./action-button";

export const getUserColumns = (): ColumnDef<UserFormSchema>[] => [
  {
    accessorKey: "empCode",
    header: "Emp Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.empCode}</span>
    ),
  },

  {
    accessorKey: "userName",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.userName}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.email}
        </span>
      </div>
    ),
  },

  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.department}</span>
    ),
  },

  {
    accessorKey: "plant",
    header: "Plant",
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.original.role}
      </Badge>
    ),
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge className="bg-green-600 text-white">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      ),
  },

  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionButton userData={row.original} />,
  },
];
