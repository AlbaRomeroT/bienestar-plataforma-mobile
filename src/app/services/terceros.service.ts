import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TercerosService {

  private bienestarUrl: string = environment.bienestarUrlApi;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getTerceronatural(tipo_doc, num_doc) {
    let data = {
      dataHeader: {
        codUsr: "RDUSSAN",
        sistemaOrigen: "8000",
        paisISO: "CO",
        direccionIp: "10.0.12.13"
      },
      data: {
        datosTercero: {
          tipoDocumento: tipo_doc,
          numeroDocumento: num_doc
        }
      }
    }

    let url = `${this.bienestarUrl}/comunes/personas`;
    return this.http.post(url, data, { headers: { 'Content-Type': 'application/json' } });
  }

  async saveUserDacadoo(user: User) {
    return this.http.post(`${this.bienestarUrl}/bienestar/auth`,
        {'uid': await this.authService.getUid(), 'email': user.email },
        { headers: { 'Content-Type': 'application/json' } }).subscribe();
  }

  getIsClientOrNot(data: any) {
    let url = `${this.bienestarUrl}/comunes/personas/validaClientePreferente`;
    return this.http.get(url, {params : data});
  }
}
