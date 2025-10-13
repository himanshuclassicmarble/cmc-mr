import React, { useState } from "react";
import UserTable from "./user-table";
import { ColumnDef } from "@tanstack/react-table";
import { UserFormSchema } from "./schema";

interface UserTableWrapperProps {
  data: UserFormSchema[];
  columns: ColumnDef<UserFormSchema>[];
}

function UserTableWrapper({ data, columns }: UserTableWrapperProps) {
  const [tableData, setTableData] = useState<UserFormSchema[]>(data);
  const handleAddData = (newData: UserFormSchema) => {
    setTableData((prevData) => [...prevData, newData]);
  };
  return (
    <div>
      <UserTable data={tableData} columns={columns} onAddData={handleAddData} />
    </div>
  );
}

export default UserTableWrapper;
