import { MaterialRateRequestor } from "./mr-rate-form/types";
import { MaterialRateItem } from "./mr-rate-table/types";

export interface MaterialRateRequestData extends MaterialRateRequestor {
  items: MaterialRateItem[];
}
