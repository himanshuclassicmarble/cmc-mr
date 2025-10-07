import MaterialTable from "./table/material-table";

const MaterialInfo = () => {
  return (
    <div className="w-full max-w-7xl h-full mx-auto min-h-screen flex flex-col justify-center items-center">
      <div>
        <MaterialTable />
      </div>
    </div>
  );
};

export default MaterialInfo;
