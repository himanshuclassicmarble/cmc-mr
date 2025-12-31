import { MRRequestTableWrapper } from "./components/mr-request-tablewrapper";
import { materialRequest } from "./utils";

const HomeScreen = () => {
  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
        Material Request
      </h1>
      <main>
        <MRRequestTableWrapper data={materialRequest} />
      </main>
    </div>
  );
};

export default HomeScreen;
