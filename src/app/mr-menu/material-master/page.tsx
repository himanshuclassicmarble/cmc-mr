import React from "react";
import { materialMaster } from "./data";
import { TableWrapper } from "./_components/table-wrapper";

export default function page() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <header className="h-14 px-4 font-bold text-foreground text-lg rounded-lg flex items-center bg-secondary ">
        Material Master
      </header>
      <main>
        <TableWrapper data={materialMaster} />
      </main>
    </div>
  );
}
