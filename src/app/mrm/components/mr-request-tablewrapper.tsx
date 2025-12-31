"use client";
import { MaterialRateValues } from "./mr-request-forms/schema";
import MRRequestTable from "./mr-request-table/mr-request-table";
import { getMRRequestColumns } from "./mr-request-table/mr-request-column";
import { MaterialMaster } from "../../material-master/types";

interface MRRequestTableWrapperProps {
  data: MaterialRateValues[];
  materialMaster: MaterialMaster[];
  isAuthorised: boolean;
  currentUserEmail: string | undefined;
}

export const MRRequestTableWrapper = ({
  data,
  materialMaster,
  isAuthorised,
  currentUserEmail,
}: MRRequestTableWrapperProps) => {
  return (
    <MRRequestTable
      materialMaster={materialMaster}
      data={data}
      columns={getMRRequestColumns(
        materialMaster,
        isAuthorised,
        currentUserEmail,
      )}
    />
  );
};
