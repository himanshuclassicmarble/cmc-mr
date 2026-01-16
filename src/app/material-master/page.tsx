import { getMaterialMaster } from "@/lib/data/material-master";
import { TableWrapper } from "./_components/table-wrapper";
import SyncMaterialsButton from "./_components/manual-sync/manual-sync";

export default async function Page() {
  const materialMaster = await getMaterialMaster();

  return (
    <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Material Master
      </h1>
      <SyncMaterialsButton />
      <main>
        <TableWrapper data={materialMaster} />
      </main>
    </div>
  );
}
