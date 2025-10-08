import React from "react";
import RequestForm from "./_components/request-form/request-form";
import { PlusIcon } from "lucide-react";

function page() {
  return (
    <div className="w-full max-w-7xl mx-auto h-full lg:min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-2">
        <h1 className="px-2 py-4 text-2xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <span className="underline underline-offset-8 decoration-primary">
            Add Request
          </span>
        </h1>
        <RequestForm />
      </div>
    </div>
  );
}

export default page;
