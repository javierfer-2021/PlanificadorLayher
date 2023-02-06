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


  //#region -- Buscar && ver OFERTAS, OFERTAS_LINEAS
  
  async getOfertas(): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/ofertas/getOfertas', body, Utilidades.getHeaders());
  }  

  async getLineasOferta(oferta): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdOferta:oferta } };    
    return this.http.post(ConfiGlobal.URL + '/api/ofertas/getLineasOferta', body, Utilidades.getHeaders());
  } 

  async getCombos_PantallaOfertas(): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { } };    
    return this.http.post(ConfiGlobal.URL + '/api/ofertas/getCombos_PantallaOfertas', body, Utilidades.getHeaders());
  }  


  //#endregion


  //#region -- Importar Ofertas

  async cargarDatosCSV_LineasOferta(fileToUpload: File): Promise<Observable<any>> {
    const url =  ConfiGlobal.URL + '/api/ofertas/cargarDatosCSV_LineasOferta';
    const formData = new FormData();
    formData.append('fichero', fileToUpload, fileToUpload.name);
    formData.append('usuario', ConfiGlobal.Usuario.toString());

    // const body = { LogData: Utilidades.RecuperarLog(), usuario : ConfiGlobal.Usuario, datos: formData };
    return this.http.post<any>(url, formData, this.headers);
  }  

  async importarOferta(oferta,cliente,contrato,idEstado,fechaAlta,fechaInicio,fechaFin,obra,observaciones,idAlmacen,lineas ): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
    
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdOferta:oferta
                                                          ,Cliente:cliente
                                                          ,Contrato:contrato
                                                          ,IdEstado:idEstado
                                                          ,FechaAlta:fechaAlta
                                                          ,FechaInicio:fechaInicio
                                                          ,FechaFin:fechaFin
                                                          ,Obra:obra
                                                          ,Observaciones:observaciones
                                                          ,IdAlmacen:idAlmacen
                                                          ,LineasImportacion:lineas

    } };    
    return this.http.post(ConfiGlobal.URL + '/api/ofertas/importarOferta', body, Utilidades.getHeaders());
  }   
  
  //#endregion


  //#region -- Prueba obtener datos del planificador

  async getPlanificacion(oferta): Promise<Observable<any>>{ // Promise<Observable<any>>
    //await Utilidades.establecerConexion();
    while (ConfiGlobal.principalValidando) {
      await Utilidades.delay(500);
    }
  
    const body = { usuario : ConfiGlobal.Usuario, datos: { IdOferta:oferta } };    
    return this.http.post(ConfiGlobal.URL + '/api/ofertas/getPlanificacion', body, Utilidades.getHeaders());
  } 

  //#endregion

}
