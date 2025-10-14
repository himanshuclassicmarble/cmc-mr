import { materialRequest } from "../../data";
import { MaterialOption } from "./types";

export const materialOption: MaterialOption[] = materialRequest.map((item) => ({
  materialCode: item.material,
  description: item.materialDescription,
}));
