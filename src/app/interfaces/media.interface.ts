export interface Media {
  id?: string;
  type?: string;
  kind?: string;
  formats?: MediaFormat[];
}

export interface MediaFormat {
  width?: number;
  height?: number;
  contentType?: string;
  type?: string;
  href?: string;
}
