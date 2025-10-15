import React from "react";
import MasterTable from "../_components/approval-table/approval-table";
import { userData } from "./data";
import UserCreateForm from "./components/user-form/user-create-form";
import { User, Users } from "lucide-react";
import { UserTableWrapper } from "./components/user-table-wrapper";

export default function page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <header className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg backdrop-blur-sm">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">
                  User Management
                </h1>
                <p className="text-primary-foreground/80 text-sm mt-0.5">
                  Manage and organize your users
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="bg-card border rounded-xl shadow-sm p-6">
          <UserTableWrapper data={userData} />
        </main>
      </div>
    </div>
  );
}
