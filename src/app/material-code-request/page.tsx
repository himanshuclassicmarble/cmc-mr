import React from "react";

import { Card } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import MRCodeTable from "./components/mr-code-table/mr-code-table";
import MRCodeForm from "./components/mr-code-form/mr-code-form";
import { materialCodeRequest } from "./components/data";

function Page() {
  return (
    <div className="w-full max-w-7xl h-full mx-auto lg:min-h-screen flex flex-col justify-center items-center">
      <div className="px-2 md:px-4 py-2">
        <h1 className="px-2 py-4 text-2xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <span className="underline underline-offset-8 decoration-primary">
            Material Request Rate
          </span>
        </h1>
        <Card className=" p-4 shadow-none space-y-4">
          <MRCodeForm data={materialCodeRequest} />
          <Separator orientation="horizontal" />
          <MRCodeTable items={materialCodeRequest.items} />
        </Card>
      </div>
    </div>
  );
}

export default Page;
