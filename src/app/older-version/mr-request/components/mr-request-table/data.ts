import { materialMaster } from "@/app/mr-menu/material-master/data";
import { MaterialOption } from "./types";

export const materialOption: MaterialOption[] = materialMaster.map((item) => ({
  materialCode: item.materialCode,
  description: item.materialDescription,
}));
