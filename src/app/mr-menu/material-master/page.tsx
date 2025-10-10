import React from "react";
import MasterTable from "../_components/approval-table/approval-table";
import { materialData } from "./data";
import { materialMasterColumns } from "./_components/material-master-columns";
import MRCreateForm from "./_components/mr-form/mr-create-form";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <header className="h-14 px-4 font-bold text-foreground text-lg rounded-lg flex items-center bg-secondary ">
        Material Master
      </header>
      <main>
        <MasterTable
          data={materialData}
          columns={materialMasterColumns}
          component={<MRCreateForm />}
        />
      </main>
    </div>
  );
}
