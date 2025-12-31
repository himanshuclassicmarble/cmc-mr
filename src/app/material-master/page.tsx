import { getMaterialMaster } from "@/lib/data/material-master";
import { TableWrapper } from "./_components/table-wrapper";

export default async function Page() {
  const materialMaster = await getMaterialMaster();

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Material Master
      </h1>
      <main>
        <TableWrapper data={materialMaster} />
      </main>
    </div>
  );
}
