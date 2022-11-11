import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';

@Injectable({
  providedIn: 'root'
})
export class PlanificadorService {
  
  headers = {
    headers: new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ConfiGlobal.Token
    })
  };

  constructor(private http: HttpClient) { }

  async cargarDatos(fileToUpload: File): Promise<Observable<any>> {
    const url =  ConfiGlobal.URL + '/api/planificador/cargarDatos';
    const formData = new FormData();
    formData.append('fichero', fileToUpload, fileToUpload.name);
    formData.append('usuario', ConfiGlobal.Usuario.toString());

    // const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: formData };

    return this.http.post<any>(url, formData, this.headers);
  }
}
