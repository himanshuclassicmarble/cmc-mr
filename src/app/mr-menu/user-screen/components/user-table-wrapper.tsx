"use client";
import { useState } from "react";
import UserTable from "./user-table";
import { UserFormSchema } from "./schema";
import { getUserColumns } from "./user-column";

interface UserTableWrapperProps {
  data: UserFormSchema[];
}

export const UserTableWrapper = ({ data }: UserTableWrapperProps) => {
  const [tableData, setTableData] = useState<UserFormSchema[]>(data);

  const handleAddData = (newData: UserFormSchema) => {
    setTableData((prev) => [...prev, newData]);
  };

  const handleUpdateData = (updatedRow: UserFormSchema, rowIndex: number) => {
    setTableData((prev) => {
      const copy = [...prev];
      copy[rowIndex] = updatedRow;
      return copy;
    });
  };

  const columns = getUserColumns(handleUpdateData);

  return (
    <UserTable data={tableData} columns={columns} onAddData={handleAddData} />
  );
};
