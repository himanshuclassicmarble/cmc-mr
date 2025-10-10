import UserTable from "./user-table";

const UserDataTable = () => {
  return (
    <div className="w-full  h-full flex flex-col justify-center items-center">
      <div className="p-2">
        <h1 className="px-2 py-4 text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
          <span className="underline underline-offset-8 decoration-primary">
            User Data
          </span>
        </h1>
        <UserTable />
      </div>
    </div>
  );
};

export default UserDataTable;
