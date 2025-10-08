import React from "react";

import RequestTable from "./components/requesttable";
import RequestForm from "./components/requestform";
import { Card } from "@/components/ui/card";

function page() {
  return (
    <div className="w-full max-w-7xl h-full mx-auto flex flex-col space-x-4">
      <Card className="p-4 m-2 md:m-4 shadow-none">
        <div>
          <RequestForm />
        </div>
        <div>
          <RequestTable />
        </div>
      </Card>
    </div>
  );
}

export default page;
