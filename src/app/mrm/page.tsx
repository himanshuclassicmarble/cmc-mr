import { getMaterialRequest } from "@/lib/data/material-request";
import { MRRequestTableWrapper } from "./components/mr-request-tablewrapper";
import { getMaterialMaster } from "@/lib/data/material-master";
import { getCurrentProfile } from "@/lib/data/current-profile";

const MRM = async () => {
  const materialRequestData = await getMaterialRequest();
  const materialMaster = await getMaterialMaster();
  const currentProfile = await getCurrentProfile();

  const role = currentProfile?.role;
  const userEmail = currentProfile?.email;

  const isAuthorised = role === "admin" || role === "hod";

  return (
    <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 space-y-4">
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Material Request
      </h1>

      <main>
        <MRRequestTableWrapper
          data={materialRequestData}
          materialMaster={materialMaster}
          isAuthorised={isAuthorised}
          currentUserEmail={userEmail}
        />
      </main>
    </div>
  );
};

export default MRM;
