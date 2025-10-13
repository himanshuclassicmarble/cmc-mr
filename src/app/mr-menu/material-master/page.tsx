import React from "react";
import MasterTable from "../_components/approval-table/approval-table";
import MRCreateForm from "./_components/mr-master-form/mr-create-form";
import { materialMaster } from "./data";
import { TableWrapper } from "./_components/table-wrapper";
import { getMaterialMasterColumns } from "./_components/mr-request-table/material-master-columns";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <header className="h-14 px-4 font-bold text-foreground text-lg rounded-lg flex items-center bg-secondary ">
        Material Master
      </header>
      <main>
        <TableWrapper cols={getMaterialMasterColumns} data={materialMaster} />
      </main>
    </div>
  );
}
