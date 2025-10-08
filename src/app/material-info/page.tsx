import MaterialTable from "./table/material-table";

const MaterialInfo = () => {
  return (
    <div className="w-full max-w-7xl h-full mx-auto lg:min-h-screen flex flex-col justify-center items-center">
      <div className="p-2">
        <h1 className="px-2 py-4 text-2xl md:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <span className="underline underline-offset-8 decoration-primary">
            Material Request Table
          </span>
        </h1>
        <MaterialTable />
      </div>
    </div>
  );
};

export default MaterialInfo;
