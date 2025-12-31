"use client";
import UserTable from "./user-table/user-table";
import { UserFormSchema } from "./schema";
import { getUserColumns } from "./user-table/user-column";

interface UserTableWrapperProps {
  data: UserFormSchema[];
}

export const UserTableWrapper = ({ data }: UserTableWrapperProps) => {
  const columns = getUserColumns();

  return <UserTable data={data} columns={columns} />;
};
