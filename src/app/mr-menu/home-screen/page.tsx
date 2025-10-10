import MasterTable from "../_components/approval-table/approval-table";
import { MRHomeColumn } from "./components/mr-home-column";
import { CreateMaterialRequest } from "./components/mr-request-forms/create-material-request";
import { materialData } from "./data";

const HomeScreen = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 gap-4">
      <header className="h-14 font-bold text-foreground rounded-lg">
        Home Screen
      </header>
      <main>
        <MasterTable
          data={materialData}
          columns={MRHomeColumn}
          component={<CreateMaterialRequest />}
        />
      </main>
    </div>
  );
};

export default HomeScreen;
