export interface MaterialOption {
  materialCode: string;
  description: string;
}

export interface CreateMaterialRequestProps {
  materialOption: MaterialOption[];
}
