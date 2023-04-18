import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';

@Injectable({
  providedIn: 'root'
})
export class PeticionesGeneralesService {
  
  headersLogin = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  headers;

  constructor(private http: HttpClient) { }

  // login
  login(usuario, password, version): Observable<any> {
    const body = { Username: usuario, Password: password, Version: version };
    return this.http.post(ConfiGlobal.URL + '/api/login/authenticate', body, this.headersLogin);
  }

  cerrarSesion(): Observable<any> {
    const body = { LogData: Utilidades.RecuperarLog(), usuario: ConfiGlobal.Usuario };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/principal/logout', body, this.headers);
  }

  actualizarApk(usuario, password) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { LogData: Utilidades.RecuperarLog(), Username: usuario, Password: password };

    return this.http.post(ConfiGlobal.URL + '/api/login/actualizar', body, { headers, responseType: 'blob' as 'json', reportProgress: true, observe: "events"});
  }
  
  async getTareasPendientes(): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/principal/getTareasPendientes'))
      return;

    const body = { 
      LogData: Utilidades.RecuperarLog(),
      SessionID: ConfiGlobal.sessionId,
      usuario : ConfiGlobal.Usuario, datos: { Recepcion: false,
                                              Picking: false,
                                              Ubicacion: false,
                                              Reubicacion: false,
                                              Reposicion: false,
                                              Inventario: false } };
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/principal/getTareasPendientes', body, this.headers);
  }

  async enviarLog(nombreLog, arrayLog): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/principal/EnviarLog'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { Nombre: nombreLog, Datos: arrayLog } };


    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/principal/EnviarLog', body, this.headers);
  }

  


}
