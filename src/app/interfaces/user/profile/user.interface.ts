export interface FamiliyInfo {
  email: string;
  disease: boolean;
  dependents: boolean;
  contactPhone: string;
  contactName: string;
  fourteenCkecked: boolean;
  sixtyChecked: boolean;
  healthSectorChecked: boolean;
  fifteenAndfiftyNineChecked: boolean;
  none: boolean;
}

export interface ProfessionalInfo {
  email?: string;
  nameCompany?: string;
  nameEps?: string;
  nameArl?: string;
  namePosition?: string;
  nameSector?: string;
  actualSituation?: string;
  checkBolivar?: boolean;
}

export interface PersonalInfo {
  email?: string;
  name?: string;
  birthday?: Date;
  lastName?: string;
  phone?: string;
  gender?: string;
  height?: string;
  weight?: any;
  photo?: string;
  documentType?: string;
  document?: string;
  dataTratementAcceptBolivar?: boolean;
  dataTratementAcceptOthers?: boolean;
}
