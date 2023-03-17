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

  //#region - USUARIOS

  async getListaUsuarios(): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/getListaUsuarios', body, Utilidades.getHeaders());
  }  

  async insertarUsuario(login,password,nombreUsuario,email,idIdioma,fechaAlta,fechaBaja,baja,administrador,verAlmacenes,idAlmacenDefecto,skin,perfil,idPersonal): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: {Login: login,
                                                          Password: password,
                                                          NombreUsuario: nombreUsuario,
                                                          Email: email,
                                                          IdIdioma: idIdioma,                                                         
                                                          FechaAlta: fechaAlta,
                                                          FechaBaja: fechaBaja,
                                                          Baja: baja,
                                                          Administrador: administrador,
                                                          VerAlmacenes : verAlmacenes,
                                                          IdAlmacenDefecto: idAlmacenDefecto,
                                                          Skin: skin,
                                                          Perfil: perfil,
                                                          IdPersonal: idPersonal
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/insertarUsuario', body, Utilidades.getHeaders());
  }  

  async actualizarUsuario(idUsuario,login,password,nombreUsuario,email,idIdioma,fechaAlta,fechaBaja,baja,administrador,verAlmacenes,idAlmacenDefecto,skin,perfil,idPersonal): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdUsuario: idUsuario,
                                                          Login: login,
                                                          Password: password,
                                                          NombreUsuario: nombreUsuario,
                                                          Email: email,
                                                          IdIdioma: idIdioma,                                                         
                                                          FechaAlta: fechaAlta,
                                                          FechaBaja: fechaBaja,
                                                          Baja: baja,
                                                          Administrador: administrador,
                                                          VerAlmacenes : verAlmacenes,
                                                          IdAlmacenDefecto: idAlmacenDefecto,
                                                          Skin: skin,
                                                          Perfil: perfil,
                                                          IdPersonal: idPersonal
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/ActualizarUsuario', body, Utilidades.getHeaders());
  }    

  //#endregion


  //#region - Maestro STOCK-ARTICULOS

  async getStockArticulos(almacen): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/getListaArticulosStock', body, Utilidades.getHeaders());
  }  

  //#endregion


  //#region - ENTRADAS - Importar del ERP

  async cargarEntrada_from_ERP(contrato): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { Contrato:contrato } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/cargarEntrada_from_ERP', body, Utilidades.getHeaders());
  }   

  async importarEntrada(idEntradaERP,contrato,referencia,idEstado,fechaAlta,fechaPrevista,fechaConfirmada,idProveedor,idProveedorERP,nombreProveedor,observaciones,idAlmacen,idTipoDocumento,confirmada,lineasEntrada ): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdEntradaERP:idEntradaERP
                                                          ,Contrato:contrato
                                                          ,Referencia:referencia
                                                          ,IdEstado:idEstado
                                                          ,FechaAlta:fechaAlta
                                                          ,FechaPrevista:fechaPrevista
                                                          ,FechaConfirmada:fechaConfirmada
                                                          ,IdProveedor:idProveedor
                                                          ,IdProveedorERP:idProveedorERP
                                                          ,NombreProveedor:nombreProveedor
                                                          ,Observaciones:observaciones
                                                          ,IdAlmacen:idAlmacen
                                                          ,IdTipoDocumento:idTipoDocumento
                                                          ,Confirmada:confirmada
                                                          ,LineasEntradaERP:lineasEntrada
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/importarEntrada_ERP', body, Utilidades.getHeaders());
  }   

  async getEntradasAlmacen(almacen): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getListaEntradasAlmacen', body, Utilidades.getHeaders());
  }  

  async getLineasEntrada(idEntrada): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdEntrada:idEntrada } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getLineasEntrada', body, Utilidades.getHeaders());
  }  

  async getCombos_PantallaEntradas(): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getCombos_PantallaEntradas', body, Utilidades.getHeaders());
  }   

  //#endregion

  
  //#region - SALIDAS - Importar del ERP

  async cargarSalida_from_ERP(contrato): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { Contrato:contrato } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/cargarSalida_from_ERP', body, Utilidades.getHeaders());
  }   

  async importarSalida(idSalidaERP,contrato,referencia,idEstado,fechaAlta,fechaInicio,fechaFin,idCliente,idClienteERP,nombreCliente,obra,observaciones,idAlmacen,idTipoDocumento,planificar,lineasSalida ): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSalidaERP:idSalidaERP
                                                          ,Contrato:contrato
                                                          ,Referencia:referencia
                                                          ,IdEstado:idEstado
                                                          ,FechaAlta:fechaAlta
                                                          ,FechaInicio:fechaInicio
                                                          ,FechaFin:fechaFin
                                                          ,IdCliente:idCliente
                                                          ,IdClienteERP:idClienteERP
                                                          ,NombreCiente:nombreCliente
                                                          ,Obra:obra
                                                          ,Observaciones:observaciones
                                                          ,IdAlmacen:idAlmacen
                                                          ,IdTipoDocumento:idTipoDocumento
                                                          ,Planificar:planificar
                                                          ,LineasSalidaERP:lineasSalida
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/importarSalida_ERP', body, Utilidades.getHeaders());
  }   

  async getSalidasAlmacen(almacen): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getListaSalidasAlmacen', body, Utilidades.getHeaders());
  }  

  async getLineasSalida(idSalida): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getLineasSalida', body, Utilidades.getHeaders());
  }  

  async getCombos_PantallaSalidas(): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getCombos_PantallaSalidas', body, Utilidades.getHeaders());
  }   

  //#endregion

  
  //#region - PLANIFICADOR 

  async getDatosPlanificador(idSalida): Promise<Observable<any>> {
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };

    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/getPlanificacion', body, this.headers);
  }

  //#endregion

  //#region -- DESCATALOGADOS, SIN USO, EJEMOLOS --
  async cargarDatos_ficheroCSV(fileToUpload: File): Promise<Observable<any>> {
    const url =  ConfiGlobal.URL + '/api/salidas/cargarDatosCSV_LineasOferta';
    const formData = new FormData();
    formData.append('fichero', fileToUpload, fileToUpload.name);
    formData.append('usuario', ConfiGlobal.Usuario.toString());

    // const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: formData };

    return this.http.post<any>(url, formData, this.headers);
  }   
  //#endregion

}
