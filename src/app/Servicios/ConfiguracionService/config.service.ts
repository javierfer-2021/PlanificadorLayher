import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AppConfig } from '../../Clases/AppConfig';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static settings: AppConfig;

  constructor(private http: HttpClient) { }

  loadConfig(): Promise<AppConfig> {
    const jsonFile = './assets/config.'+environment.name+'.json';
    return this.http.get<AppConfig>(jsonFile).pipe(
        tap(resp => {
            console.log(resp);
            ConfigService.settings = resp;
            // reasignamos info en variables ConfigGlobal -> nombre_app, dominio, puerto, URL
            ConfiGlobal.appName = resp.nombre;
            ConfiGlobal.dominio = resp.dominio;
            ConfiGlobal.puerto = resp.puerto;
            ConfiGlobal.URL = ConfiGlobal.dominio + ':' + ConfiGlobal.puerto;
            }
        ),
        catchError(e =>  
            //console.log('No se puede cargar el archivo de configuracion '+jsonFile);
            throwError('No se puede cargar el archivo de configuracion '+jsonFile+': ${JSON.stringify(e)}')           
        )
    ).toPromise()
}

  
}
