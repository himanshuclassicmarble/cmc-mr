"use client";
import { useState } from "react";
import MRMaster from "./mr-request-table/mr-request-table";
import { ColumnDef } from "@tanstack/react-table";
import { MRMasterSchema } from "./mr-master-form/schema";
import { getMaterialMasterColumns } from "./mr-request-table/material-master-columns";

export const TableWrapper = ({ data }: { data: MRMasterSchema[] }) => {
  const [tableData, setTableData] = useState<MRMasterSchema[]>(data);

  const handleAddData = (newData: MRMasterSchema) => {
    setTableData((prev) => [...prev, newData]);
  };

  const handleUpdateData = (updatedRow: MRMasterSchema, rowIndex: number) => {
    setTableData((prev) => {
      const copy = [...prev];
      copy[rowIndex] = updatedRow;
      return copy;
    });
  };

  const columns = getMaterialMasterColumns(handleUpdateData);

  return (
    <MRMaster data={tableData} columns={columns} onAddData={handleAddData} />
  );
};
