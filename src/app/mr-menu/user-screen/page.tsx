import React from "react";
import MasterTable from "../_components/approval-table/approval-table";
import { userData } from "./data";
import { userColumns } from "./components/user-column";
import UserCreateForm from "./components/user-form/user-create-form";
import { User } from "lucide-react";

export default function page() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
      <header className="h-14 px-4 font-bold text-foreground text-lg rounded-lg flex items-center bg-secondary ">
        User Screen
      </header>
      <main>
        <MasterTable
          data={userData}
          columns={userColumns}
          component={<UserCreateForm />}
        />
      </main>
    </div>
  );
}
