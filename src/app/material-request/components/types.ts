import { MaterialRequestor } from "./mr-rate-form/types";
import { MaterialRateItem } from "./mr-rate-table/types";

export interface MaterialRequestData extends MaterialRequestor {
  items: MaterialRateItem[];
}
