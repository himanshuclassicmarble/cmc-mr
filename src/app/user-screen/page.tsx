import { getProfiles } from "@/lib/data/profiles";
import { UserTableWrapper } from "./components/user-table-wrapper";

export default async function Page() {
  const userData = await getProfiles();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          User Management
        </h1>

        <main>
          <UserTableWrapper data={userData} />
        </main>
      </div>
    </div>
  );
}
