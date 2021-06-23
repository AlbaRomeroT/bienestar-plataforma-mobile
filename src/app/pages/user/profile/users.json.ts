/*
    Datos de laboratorio..
*/

import {
  FamiliyInfo,
  ProfessionalInfo,
  PersonalInfo,
} from "../../../interfaces/user/profile/user.interface";

export const FAMILY_INFO: FamiliyInfo = {
  email: "algo@algo.com",
  disease: true,
  dependents: false,
  contactPhone: "311 579 1637",
  contactName: "Pedro",
  fifteenAndfiftyNineChecked: false,
  fourteenCkecked: false,
  healthSectorChecked: false,
  none: false,
  sixtyChecked: false,
};

export const PROFESSIONAL_INFO: ProfessionalInfo = {
  email: "correo@correo.com",
  nameArl: "Sura",
  nameCompany: "Seguros Bolivar",
  nameEps: "Coomeva",
  actualSituation: "desempleado",
  namePosition: "Lider desarrollo",
  nameSector: "Tecnologia",
  checkBolivar: false,
};

export const PERSONAL_INFO: PersonalInfo = {
  birthday: new Date(),
  document: "0001442",
  documentType: "PP",
  email: "correo@correo.com",
  gender: "M",
  height: "",
  lastName: "Perez",
  name: "Pedro",
  phone: "3115791637",
  photo: "",
  weight: "",
};
