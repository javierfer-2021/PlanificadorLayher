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

  actualizarApk(usuario, password) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { LogData: Utilidades.RecuperarLog(), Username: usuario, Password: password };

    return this.http.post(ConfiGlobal.URL + '/api/login/actualizar', body, { headers, responseType: 'blob' as 'json', reportProgress: true, observe: "events"});
  }
  
  // botones (frm-pantalla-principal)
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

  // frm-buscar-articulo
  async buscarArticulo(codArticulo, idEmpresa): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/buscarArticulo/comprobarArticulo'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { Articulo: codArticulo, Empresa: idEmpresa } };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/buscarArticulo/comprobarArticulo', body, this.headers);
  }



  // frm-buscar-ubicacion
  async buscarUbicacion(codUbicacion): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/buscarUbicacion/comprobarUbicacion'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: codUbicacion };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/buscarUbicacion/comprobarUbicacion', body, this.headers);
  }



  // frm-buscar-palet
  async buscarPalet(palet): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/buscar/comprobarPalet'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: palet };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    // Comprobar que todo esta bien (procedimiento en bbdd y webapi)
    return this.http.post(ConfiGlobal.URL + '/api/buscar/comprobarPalet', body, this.headers);
  }



  // frm-buscar-descripcion
  async buscarDescripcion(descripcion, referencia): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/buscarDescripcion/comprobarArticulo'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { Descripcion: descripcion, Referencia : referencia } };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/buscarDescripcion/comprobarArticulo', body, this.headers);
  }

  // cerrar sesion
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
  
  //#endregion ASIGNAR EAN 14 - frm-asig-ean14


  // frm-imp-etiquetas
  async validarArticulo(articulo, idEmpresa): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/imprimirEtiqueta/validarArticulo'))
      return;
    
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { strArticulo: articulo, Empresa: idEmpresa } };

    return this.http.post(ConfiGlobal.URL + '/api/imprimirEtiqueta/validarArticulo', body, Utilidades.getHeaders());
  }

  async obtenerFormatosEtiqueta(tipoEtiqueta): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/imprimirEtiqueta/obtenerFormatosEtiqueta'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: tipoEtiqueta };
    return this.http.post(ConfiGlobal.URL + '/api/imprimirEtiqueta/obtenerFormatosEtiqueta', body, Utilidades.getHeaders());
  }

  async obtenerImpresorasEtiqueta(tipoImpresora): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/imprimirEtiqueta/obtenerImpresorasEtiqueta'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: tipoImpresora };
    return this.http.post(ConfiGlobal.URL + '/api/imprimirEtiqueta/obtenerImpresorasEtiqueta', body, Utilidades.getHeaders());
  }
  
  async imprimirEtiqueta(artId, nroEtiquetas, tipoEti, impresora): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/imprimirEtiqueta/imprimir'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { ArticuloId: artId, Num_Etiquetas: nroEtiquetas, Etiqueta_id: tipoEti, Impresora_id: impresora } };
    return this.http.post(ConfiGlobal.URL + '/api/imprimirEtiqueta/imprimir', body, Utilidades.getHeaders());
  }



  // frm-ubicacion
  async comprobarPaletBulto(palet): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/ubicacion/comprobarPalet'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: palet };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/ubicacion/comprobarPalet', body, this.headers);
  }

  async comprobarUbicacionPalet(ubiId, ubiCodigo, id, tarea, manual): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/ubicacion/comprobarUbicacion'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { Ubicacion: ubiId,
                                                           strUbicacion: ubiCodigo,
                                                           Id: id,
                                                           Tarea: tarea,
                                                           Manual: manual } };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/ubicacion/comprobarUbicacion', body, this.headers);
  }

  async getIncidencias(): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/ubicacion/getIncidencias'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: '' };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/ubicacion/getIncidencias', body, this.headers);
  }

  async ubicar(idPalet, ubiId, id, incId, idTarea): Promise<Observable<any>>{
    if(!await Utilidades.establecerConexion('/api/ubicacion/ubicar'))
      return;

    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { TUB_ID_PALET: idPalet,
                                                          UBI_ID: ubiId,
                                                          TUB_ID: id,
                                                          TINC_ID: incId,
                                                          TUB_ID_TAREA: idTarea } };

    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ConfiGlobal.Token
      })
    };

    return this.http.post(ConfiGlobal.URL + '/api/ubicacion/ubicar', body, this.headers);
  }

}
