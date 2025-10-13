import { CreateMaterialRequest } from "./components/mr-request-forms/create-material-request";
import { mrRequestColumn } from "./components/mr-request-table/mr-request-column";
import MRRequestTable from "./components/mr-request-table/mr-request-table";
import { materialRequest } from "./data";

const HomeScreen = () => {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <header className="h-14 px-4 font-bold text-foreground text-lg rounded-lg flex items-center bg-secondary ">
        Home Screen
      </header>
      <main>
        <MRRequestTable data={materialRequest} columns={mrRequestColumn} />
      </main>
    </div>
  );
};

export default HomeScreen;
