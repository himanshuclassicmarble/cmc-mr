import { MaterialCodeRequestor } from "./mr-code-form/types";
import { MaterialCodeItem } from "./mr-code-table/types";



export interface MaterialCodeRequestData extends MaterialCodeRequestor {
  items: MaterialCodeItem[];
}
