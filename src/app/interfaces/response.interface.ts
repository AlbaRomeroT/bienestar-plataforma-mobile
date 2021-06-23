export interface Error {
  error: string;
  errorCode: string;
  errorDescription: string;
}

export interface ResponseDTO {
  errors: any;
  body: any;
  hasErrors: boolean;
}

export interface ResponseData<T> {
  data: T;
  links?: any[];
}
