export type DetailsOption = {
  value: string;
  label: string;
  ItemCode: string;
};

export interface CreateMaterialRequestProps {
  detailsOption: DetailsOption[];
}
