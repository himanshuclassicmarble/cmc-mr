import { MRRequestTableWrapper } from "./components/mr-request-tablewrapper";
import { materialRequest } from "./data";

const HomeScreen = () => {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <header className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-foreground/10 rounded-lg backdrop-blur-sm"></div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">
                Material Request
              </h1>
            </div>
          </div>
        </div>
      </header>
      <main className="bg-card border rounded-xl shadow-sm p-6">
        <MRRequestTableWrapper data={materialRequest} />
      </main>
    </div>
  );
};

export default HomeScreen;
