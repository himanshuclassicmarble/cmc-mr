"use client";
import { useState } from "react";
import MRMaster from "./mr-request-table/mr-request-table";
import { MRMasterSchema } from "./mr-master-form/schema";
import { getMaterialMasterColumns } from "./mr-request-table/material-master-columns";

export const TableWrapper = ({ data }: { data: MRMasterSchema[] }) => {
  const columns = getMaterialMasterColumns();

  return <MRMaster data={data} columns={columns} />;
};
