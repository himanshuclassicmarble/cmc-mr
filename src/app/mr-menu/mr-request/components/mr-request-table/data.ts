import { materialRequest } from "../../data";
import { DetailsOption } from "./types";

export const detailsOption: DetailsOption[] = materialRequest.map((item) => ({
  value: item.materialDescription,
  label: item.materialDescription,
  ItemCode: item.material,
}));
