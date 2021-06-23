export interface IHealthCard {
  tipoCarnet: string;
  nombreProducto: string;
  nombresTomador: string;
  apellidosTomador: string;
  numeroPoliza: null;
  nui: number;
  fechaInicio: string;
  fechaFin: string;
  numeroPolizaPH: number;
  tipoDocumento: string;
  numeroDocumento: number;
  plantelEducativo: null;
  nombreEmpresa: null;
  bid: null;
  codProducto: string;

  //
  side?: string;
  imageType?: string;

  // title?: string;
  // name?: string;
  // lastName?: string;
  // policy?: string;
  // nui?: string;

  // di?: string;
  // ph?: string;
  // startDate?: Date;
  // endDate?: Date;
  // bid?: string;
  // frontImage?: string;
  // backImage?: string;

  // //
  // code?: string;
  // side?: string;
  // imageType?: string;
}
