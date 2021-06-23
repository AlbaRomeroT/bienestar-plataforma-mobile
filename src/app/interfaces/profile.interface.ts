export interface Profile {
  name?: string;
  lastName?: string;
  documentType?: string;
  document?: string;
  email?: string;
  weight?: number;
  height?: number;
  photo?: string;
  birthday?: Date;
  gender?: string;
  phone?: string;
  dataTratementAcceptBolivar?: boolean;
  dataTratementAcceptOthers?: boolean;
  encryptedData?: string;
}
