"use client";

import { LinkSchemaType } from "../schema/schema";
import LinkTable from "./link-table";
import { linkColumns } from "./link-table-column";

interface LinkTableWrapperProps {
  data: LinkSchemaType[];
}

export const LinkTableWrapper = ({ data }: LinkTableWrapperProps) => {
  return <LinkTable data={data} columns={linkColumns} />;
};
