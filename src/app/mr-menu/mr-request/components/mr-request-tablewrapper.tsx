"use client";
import { useState } from "react";
import { MaterialRateValues } from "./mr-request-forms/schema";
import MRRequestTable from "./mr-request-table/mr-request-table";
import { getMRRequestColumns } from "./mr-request-table/mr-request-column";
import { materialOption } from "./mr-request-table/data";

interface MRRequestTableWrapperProps {
  data: MaterialRateValues[];
}

export const MRRequestTableWrapper = ({ data }: MRRequestTableWrapperProps) => {
  const [tableData, setTableData] = useState<MaterialRateValues[]>(data);

  const handleUpdateData = (
    reqId: string,
    srNo: string,
    updatedData: Partial<MaterialRateValues>,
  ) => {
    setTableData((prev) =>
      prev.map((row) =>
        row.reqId === reqId && row.srNo === srNo
          ? { ...row, ...updatedData }
          : row,
      ),
    );
  };

  const handleAddData = (newRequest: MaterialRateValues) => {
    setTableData((prev) => [...prev, newRequest]);
  };

  return (
    <MRRequestTable
      data={tableData}
      columns={getMRRequestColumns(
        handleUpdateData,
        Array.isArray(materialOption) ? materialOption : [],
      )}
      onAddData={handleAddData}
    />
  );
};
