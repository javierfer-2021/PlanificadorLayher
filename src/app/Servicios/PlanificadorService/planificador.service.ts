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
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + ConfiGlobal.Token
    })
  };

  constructor(private http: HttpClient) { }


  //#region - USUARIOS

  async getListaUsuarios(): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/usuarios/getListaUsuarios')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/getListaUsuarios', body, Utilidades.getHeaders());
  }  

  async getListaAlmacesUsuario(idUsuario): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/usuarios/getAlmacenesUsuario')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); } 
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdUsuario: idUsuario} };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/getAlmacenesUsuario', body, Utilidades.getHeaders());
  } 

  async insertarUsuario(login,password,nombreUsuario,email,idIdioma,fechaAlta,fechaBaja,baja,administrador,verAlmacenes,idAlmacenDefecto,skin,perfil,idPersonal,almacenesAsignados,notificacionesEmail): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/usuarios/insertarUsuario')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); } 
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
                                                          IdPersonal: idPersonal,
                                                          AlmacenesAsignados: almacenesAsignados,
                                                          NotificacionesEmail:notificacionesEmail
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/insertarUsuario', body, Utilidades.getHeaders());
  }  

  async actualizarUsuario(idUsuario,login,password,nombreUsuario,email,idIdioma,fechaAlta,fechaBaja,baja,administrador,verAlmacenes,idAlmacenDefecto,skin,perfil,idPersonal,almacenesAsignados,notificacionesEmail): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/usuarios/actualizarUsuario')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); } 
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
                                                          IdPersonal: idPersonal,
                                                          AlmacenesAsignados: almacenesAsignados,
                                                          NotificacionesEmail:notificacionesEmail
    } };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/actualizarUsuario', body, Utilidades.getHeaders());
  }    

  async eliminarUsuario(idUsuario): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/usuarios/eliminarUsuario')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdUsuario: idUsuario} };    
    return this.http.post(ConfiGlobal.URL + '/api/usuarios/eliminarUsuario', body, Utilidades.getHeaders());
  }  
   
  //#endregion


  //#region - Maestro STOCK-ARTICULOS

  async importarArticulos(): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/importarArticulos')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/importarArticulos', body, Utilidades.getHeaders());
  }  

  async importarStockArticulos(): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/importarStockArticulos')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/importarStockArticulos', body, Utilidades.getHeaders());
  }  

  async iniciarEjercicio(): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/iniciarEjercicio')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/iniciarEjercicio', body, Utilidades.getHeaders());
  }  


  async getStockArticulos(almacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/getListaArticulosStock')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/getListaArticulosStock', body, Utilidades.getHeaders());
  }  

  async getListaFamiliasSubfamilias(familia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/getListaFamiliaSubfamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdFamilia:familia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/getListaFamiliaSubfamilia', body, Utilidades.getHeaders());
  }  

  async getListaFamilias(): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/getListaFamilias')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/getListaFamilias', body, Utilidades.getHeaders());
  }  
  
  async getListaSubfamilias(familia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/getListaSubfamilias')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdFamilia:familia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/getListaSubfamilias', body, Utilidades.getHeaders());
  }  

  async actualizarArticulo(articulo,familia,subfamilia,secundario,almacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/actualizarArticulo')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdArticulo:articulo,
                                                           IdFamilia:familia,
                                                           IdSubfamilia:subfamilia, 
                                                           Secundario:secundario,
                                                           IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/actualizarArticulo', body, Utilidades.getHeaders());
  }    

  async actualizarArticuloValorSecundario(articulo,almacen,secundario): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/actualizarArticuloValorSecundario')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdArticulo:articulo,
                                                           IdAlmacen:almacen,
                                                           Secundario:secundario } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/actualizarArticuloValorSecundario', body, Utilidades.getHeaders());
  }   


  async actualizarFamilia(idFamilia,codFamiliaERP,nombreFamilia,importado,usoFiltro,fecha): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/actualizarFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdFamilia:idFamilia,
                                                           CondFamiliaERP:codFamiliaERP,
                                                           NombreFamilia:nombreFamilia, 
                                                           Importado:importado,
                                                           UsoFiltro:usoFiltro,
                                                           FechaActualizacion:fecha} };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/actualizarFamilia', body, Utilidades.getHeaders());
  }   

  async insertarFamilia(idFamilia,codFamiliaERP,nombreFamilia,importado,usoFiltro,fecha): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/insertarFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdFamilia:idFamilia,
                                                           CondFamiliaERP:codFamiliaERP,
                                                           NombreFamilia:nombreFamilia, 
                                                           Importado:importado,
                                                           UsoFiltro:usoFiltro,
                                                           FechaActualizacion:fecha} };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/insertarFamilia', body, Utilidades.getHeaders());
  }     

  async eliminarFamilia(idFamilia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/eliminarFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdFamilia:idFamilia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/eliminarFamilia', body, Utilidades.getHeaders());
  }     


  async actualizarSubFamilia(idSubfamilia,idFamilia,nombreSubfamilia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/actualizarSubFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSubfamilia:idSubfamilia,
                                                           IdFamilia:idFamilia,
                                                           NombreSubfamilia:nombreSubfamilia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/actualizarSubFamilia', body, Utilidades.getHeaders());
  }   

  async insertarSubFamilia(idSubfamilia,idFamilia,nombreSubfamilia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/insertarSubFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSubfamilia:idSubfamilia,
                                                           IdFamilia:idFamilia,
                                                           NombreSubfamilia:nombreSubfamilia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/insertarSubFamilia', body, Utilidades.getHeaders());
  }     

  async eliminarSubFamilia(idSubfamilia): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/articulostock/eliminarSubFamilia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSubfamilia:idSubfamilia } };    
    return this.http.post(ConfiGlobal.URL + '/api/articulostock/eliminarSubFamilia', body, Utilidades.getHeaders());
  }     

  //#endregion


  //#region - ENTRADAS - Importar del ERP

  async cargarEntrada_from_ERP(contrato): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/cargarEntrada_from_ERP')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { Contrato:contrato } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/cargarEntrada_from_ERP', body, Utilidades.getHeaders());
  }   

  async importarEntrada(idEntradaERP,contrato,referencia,idEstado,fechaAlta,fechaPrevista,fechaConfirmada,idProveedor,idProveedorERP,nombreProveedor,observaciones,idAlmacen,idTipoDocumento,confirmada,lineasEntrada ): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/importarEntrada_ERP')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
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

  async getEntradasAlmacen(almacen,filtroCanceladas,filtroIdArticulo,filtroFamilia,filtroSubfamilia,modoContiene,filtroOtros): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/getListaEntradasAlmacen')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdAlmacen:almacen,
                                                          FiltroCanceladas:filtroCanceladas,
                                                          FiltroIdArticulo:filtroIdArticulo,
                                                          FiltroFamilia:filtroFamilia,
                                                          FiltroSubfamilia:filtroSubfamilia,
                                                          FiltroTipoContiene:modoContiene,
                                                          FiltroOtros:filtroOtros
                                                         } };            
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getListaEntradasAlmacen', body, Utilidades.getHeaders());
  }  

  async getLineasEntrada(idEntrada): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/getLineasEntrada')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdEntrada:idEntrada } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getLineasEntrada', body, Utilidades.getHeaders());
  }  

  async getCombos_PantallaEntradas(filtroAlmacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/getCombos_PantallaEntradas')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:filtroAlmacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/getCombos_PantallaEntradas', body, Utilidades.getHeaders());
  }   

  async actualizarEntrada(idEntrada,referencia,fechaPrevista,fechaConfirmada,idEstado,nombreProveedor,observaciones,idAlmacen,confirmada,lineas): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/actualizarEntrada')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, 
                   datos: { IdEntrada: idEntrada,
                            Referencia: referencia, 
                            FechaPrevista: fechaPrevista, 
                            FechaConfirmada: fechaConfirmada, 
                            IdEstado: idEstado,
                            NombreProveedor: nombreProveedor, 
                            Observaciones: observaciones, 
                            IdAlmacen: idAlmacen, 
                            Confirmada: confirmada,
                            LineasEntrada:lineas } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/actualizarEntrada', body, Utilidades.getHeaders());
  }   

  async actualizarLineaEntrada(idEntrada,idLinea,idArticulo,fechaPrevista,fechaConfirmada,fechaActualizacion): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/entradas/actualizarLineaEntrada')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, 
                   datos: { IdEntrada: idEntrada,
                            IdLinea: idLinea,
                            IdArticulo: idArticulo,
                            FechaPrevista: fechaPrevista, 
                            FechaConfirmada: fechaConfirmada, 
                            FechaActualizacion: fechaActualizacion } };    
    return this.http.post(ConfiGlobal.URL + '/api/entradas/actualizarLineaEntrada', body, Utilidades.getHeaders());
  }     

  //#endregion

  
  //#region - SALIDAS - Importar del ERP

  async cargarSalida_from_ERP(contrato): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/cargarSalida_from_ERP')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { Contrato:contrato } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/cargarSalida_from_ERP', body, Utilidades.getHeaders());
  }   

  async importarSalida(idSalidaERP,contrato,referencia,idEstado,fechaAlta,fechaInicio,fechaFin,idCliente,idClienteERP,nombreCliente,obra,observaciones,idAlmacen,idTipoDocumento,planificar,lineasSalida ): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/importarSalida_ERP')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
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

  async getSalidasAlmacen(almacen,filtroIdArticulo,filtroFamilia,filtroSubfamilia, filtroCanceladas, modoContiene, filtroOtros): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/getListaSalidasAlmacen')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdAlmacen:almacen,
                                                          FiltroIdArticulo:filtroIdArticulo,
                                                          FiltroFamilia:filtroFamilia,
                                                          FiltroSubfamilia:filtroSubfamilia,
                                                          FiltroCanceladas:filtroCanceladas,
                                                          FiltroTipoContiene:modoContiene,
                                                          FiltroOtros:filtroOtros  
                                                        } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getListaSalidasAlmacen', body, Utilidades.getHeaders());
  }  

  async getLineasSalida(idSalida): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/getLineasSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getLineasSalida', body, Utilidades.getHeaders());
  }  

  async getCombos_PantallaSalidas(filtroAlmacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/getCombos_PantallaSalidas')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:filtroAlmacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/getCombos_PantallaSalidas', body, Utilidades.getHeaders());
  }   

  async cancelarSalida(idSalida): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/cancelarSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/cancelarSalida', body, Utilidades.getHeaders());
  }  

  async actualizarSalida(idSalida,referencia,fechaInicio,fechaFin,idEstado,nombreCliente,obra,observaciones,idAlmacen,planificar,lineas): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/actualizarSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida: idSalida,
                            Referencia: referencia, 
                            FechaInicio: fechaInicio, 
                            FechaFin: fechaFin, 
                            IdEstado: idEstado,
                            NombreCiente: nombreCliente, 
                            Obra: obra, 
                            Observaciones: observaciones, 
                            IdAlmacen: idAlmacen, 
                            Planificar: planificar,
                            LineasSalida:lineas } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/actualizarSalida', body, Utilidades.getHeaders());
  } 

  //#endregion

  
  //#region - PLANIFICADOR 

  async getDatosPlanificador(idSalida): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/getPlanificacion')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/getPlanificacion', body, Utilidades.getHeaders());
  }
  
  async eliminarArticuloPlanificador(idSalida,idArticulo,observaciones): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/eliminarLineaArticuloPlanificacion')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:idSalida, IdArticulo:idArticulo, Observaciones:observaciones } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/eliminarLineaArticuloPlanificacion', body, Utilidades.getHeaders());
  }

  async insertarArticuloPlanificador(idSalida,idArticulo,unidades,observaciones): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/insertarLineaArticuloPlanificacion')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:idSalida, IdArticulo:idArticulo, Unidades:unidades, Observaciones:observaciones } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/insertarLineaArticuloPlanificacion', body, Utilidades.getHeaders());
  }

  async cambiarArticuloPlanificador(idSalida,idArticulo,motivoEliminar,idNewArticulo,unidades,observaciones): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/cambiarLineaArticuloPlanificacion')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:idSalida,
                            IdArticulo:idArticulo, MotivoEliminar:motivoEliminar,
                            IdArticuloCambio:idNewArticulo, Unidades:unidades, Observaciones:observaciones } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/cambiarLineaArticuloPlanificacion', body, Utilidades.getHeaders());
  }

  async planificarContratoSalida(idSalida): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/planificarContratoSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:idSalida } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/planificarContratoSalida', body, Utilidades.getHeaders());
  }
  
  async desPlanificarContratoSalida(idSalida): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/desPlanificarContratoSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }      
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:idSalida } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/desPlanificarContratoSalida', body, Utilidades.getHeaders());
  }

  async actualizarLineasPlanificadas(salida,articulo,unidades,listaSalidas): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/actualizarLineasPlanificadas')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }      
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdSalida:salida,
                            IdArticulo:articulo,
                            UndServidas:unidades,
                            lineasReplanificar:listaSalidas } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/actualizarLineasPlanificadas', body, Utilidades.getHeaders());
  }

  async getDatosPlanificadorArticulos(almacen,articulos): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/getPlanificacionAriculo')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }      
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, 
                   datos: { IdAlmacen:almacen, ListaArticulos:articulos } };

    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/getPlanificacionAriculo', body, Utilidades.getHeaders());
  }

  //#endregion

  
  //#region - CONFIGURACION 

  async getConfigPlanificador(): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/getConfiguracionLayher')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }          
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/getConfiguracionLayher', body, Utilidades.getHeaders());
  }

  async setConfigPlanificador(numItemPlanificador, 
                              entradaConfirmarDefecto, entradaEstadoDefecto, entradaAlmacenDefecto, 
                              salidaPlanificarDefecto, salidaEstadoDefecto, salidaAlmacenDefecto,
                              enviarMailAlertas, diasPermitidosSinConfirmar): Promise<Observable<any>> {    
    if(!await Utilidades.establecerConexion('/api/planificador/setConfiguracionLayher')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }          
    const body = { LogData: Utilidades.RecuperarLog(), 
                   usuario : ConfiGlobal.Usuario, datos: {NumItemPlanificador: numItemPlanificador, 
                                                          EntradaConfirmarDefecto: entradaConfirmarDefecto, 
                                                          EntradaEstadoDefecto: entradaEstadoDefecto, 
                                                          EntradaAlmacenDefecto: entradaAlmacenDefecto, 
                                                          SalidaPlanificarDefecto: salidaPlanificarDefecto, 
                                                          SalidaEstadoDefecto: salidaEstadoDefecto, 
                                                          SalidaAlmacenDefecto: salidaAlmacenDefecto,
                                                          EnviarMailAlertas: enviarMailAlertas,
                                                          DiasPermitidosSinConfirmar: diasPermitidosSinConfirmar
                                                         } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/setConfiguracionLayher', body, Utilidades.getHeaders());
  }

  //#endregion
  

  //#region - GESTION DE INCIDENCIAS

  async getIncidenciasAlmacen(almacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/incidencias/getListaIncidenciasAlmacen')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }          
    const body = { usuario : ConfiGlobal.Usuario, datos: {IdAlmacen:almacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/incidencias/getListaIncidenciasAlmacen', body, Utilidades.getHeaders());
  }  


  async insertarIncidencia(idTipoIncidencia,fechaAlta,fechaIncidencia,descripcion,idAlmacen,idDocumento,idTipoDocumento,contrato,idCliProv,nombreCliProv,idArticulo,unidades,observaciones): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/incidencias/insertarIncidencia')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }          
    const body = { usuario : ConfiGlobal.Usuario, 
                   datos: { IdTipoIncidencia: idTipoIncidencia, 
                            FechaAlta: fechaAlta, 
                            FechaIncidencia: fechaIncidencia,
                            Descripcion: descripcion,
                            IdAlmacen: idAlmacen,
                            IdDocumento: idDocumento,
                            IdTipoDocumento: idTipoDocumento,
                            Contrato: contrato,
                            IdClienteProveedor: idCliProv,
                            NombreCienteProveedor: nombreCliProv,
                            IdArticulo: idArticulo,
                            Unidades: unidades,
                            Observaciones: observaciones } };    
    return this.http.post(ConfiGlobal.URL + '/api/incidencias/insertarIncidencia', body, Utilidades.getHeaders());
  } 

  async getCombos_PantallaIncidencias(filtroAlmacen): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/incidencias/getCombos_PantallaIncidencias')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }          
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdAlmacen:filtroAlmacen } };    
    return this.http.post(ConfiGlobal.URL + '/api/incidencias/getCombos_PantallaIncidencias', body, Utilidades.getHeaders());
  }   

  //#endregion


  // -------------------------------------------
  //#region -- SIMULACION PLANIFICADOR SALIDA CSV -> TABLA TEMPORAL  --
  
  // guardar simulacion Salida
  async ImportarSimulacionSalidaCSV(idSalidaERP,contrato,referencia,idEstado,fechaAlta,fechaInicio,fechaFin,idCliente,idClienteERP,nombreCliente,obra,observaciones,idAlmacen,idTipoDocumento,planificar,lineasSalida ): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/importarSimulacionSalida_CSV')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
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
    return this.http.post(ConfiGlobal.URL + '/api/salidas/importarSimulacionSalida_CSV', body, Utilidades.getHeaders());
  }   

  async BorrarSimulacionSalidaCSV(idSalida ): Promise<Observable<any>>{ 
    if(!await Utilidades.establecerConexion('/api/salidas/BorrarSimulacionSalida')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };    
    return this.http.post(ConfiGlobal.URL + '/api/salidas/BorrarSimulacionSalida', body, Utilidades.getHeaders());
  } 

  async getDatosSimulacionPlanificador(idSalida): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/planificador/getSimulacionPlanificacion')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }  
    const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: { IdSalida:idSalida } };
    return this.http.post<any>(ConfiGlobal.URL + '/api/planificador/getSimulacionPlanificacion', body, Utilidades.getHeaders());
  }

  // obtenerSimulacionPlanificacion
  
  //#endregion



  // -------------------------------------------
  //#region -- DESCATALOGADOS, SIN USO, EJEMOLOS --
  async cargarDatosCSV_LineasSalidas(fileToUpload: File): Promise<Observable<any>> {
    if(!await Utilidades.establecerConexion('/api/salidas/cargarDatosCSV_LineasOferta')) return;
    // while (ConfiGlobal.principalValidando) { await Utilidades.delay(500); }   

    const url =  ConfiGlobal.URL + '/api/salidas/cargarDatosCSV_LineasOferta';
    const formData = new FormData();
    formData.append('fichero', fileToUpload, fileToUpload.name);
    formData.append('usuario', ConfiGlobal.Usuario.toString());
    // formData.append('almacen', '1');

    // const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: formData };

    return this.http.post<any>(url, formData, Utilidades.getHeaders());
  }   
  //#endregion

}
