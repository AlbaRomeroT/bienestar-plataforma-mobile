import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class PurecloudService {
  constructor(private http: HttpClient) {}

  sendEmergencyCallRequest(data: any) {
    let url = `${environment.bienestarUrlApi}/comunes/asistencia`;
    let info = {
      callbackNumbers: [data.telefono],
      documentType: data.tipoDocumento,
      documentNumber: data.numDocumento,
      firstName:data.nombre,
      lastName:data.apellido
    };
    return this.http.post<any>(url, info);
  }
}
