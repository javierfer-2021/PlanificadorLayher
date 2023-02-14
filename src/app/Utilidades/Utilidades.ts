import { Login } from './../Clases/Login';
import { Conexion } from './../Clases/Conexion';
import { ColumnDataGrid } from './../Clases/ColumnDataGrid';
import { RespuestaWebApi } from './../Clases/RespuestaWebApi';
import { BotonPantalla } from './../Clases/BotonPantalla';
import { WebsocketService } from './../Servicios/WebSocketService/websocket.service';
import { CmpDataGridComponent } from './../Componentes/cmp-data-grid/cmp-data-grid.component';
import { ComponentFactoryResolver, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { custom } from 'devextreme/ui/dialog';
import { DxPopupComponent } from 'devextreme-angular';
import { timeout } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { TiposTamPantalla } from '../Enumeraciones/TiposTamPantalla';
import { Pantalla } from '../Enumeraciones/Pantalla';
import { ResultadoWebApi } from '../Enumeraciones/ResultadoWebApi';
import { GS1DATOSDECO } from '../Clases/ean128/GS1DATOSDECO';
import { TipoLectura } from '../Enumeraciones/TipoLectura';
import { TipoDialogo } from '../Enumeraciones/TipoDialogo';
import { Log } from '../Clases/Log';
import { TipoDocumento } from '../Enumeraciones/TipoDocumento';

import * as fs from 'fs-web';
import { ConfiGlobal } from './ConfiGlobal';


/*
* Los botones de accion de las pantallas son dinamicos
* para que funcione correctamente se debe:
* - crear un div con id = container
    - height:100%
    - overflow-y: auto;
    - (window:resize)="onResize($event)"
    <div class="container"
    #container
    (window:resize)="onResize($event)"
    style="overflow-y: auto; height: 100%;">
    </div>

* - crear un div con id = btnFooter
* - dentro, llamar al componente, pasarle la lista de botones
        <div #btnFooter>
            <app-cmp-botones-pantallas [botones]=" btnAciones">
            </app-cmp-botones-pantallas>
        </div>
* - la lista de botones , 1 como min, 4 como max
* - la posicion es la siguiente:
* - [1]

* - [1][2]

* - [1][2][3]

* - [1][2][3]
    [   4   ]

    *
  { icono: '', texto: 'Guardar1', posicion: 1, accion: () => { }, tipo: TipoBoton.nes.TipoBoton.success },
* - llamar a Utilidades.BtnFooterUpdate() en:
* - ngAfterViewInit()
* - onResize(event)=> (puesto en el div #container)


*/

export class Utilidades {
    public static translate: TranslateService;
    public static resolver: ComponentFactoryResolver;
    public static http: HttpClient;
    public static router: Router;

    public static WebsocketService: WebsocketService;

    public static CompActual: any;

    constructor(_translate: TranslateService, _resolver: ComponentFactoryResolver, _http: HttpClient, _router: Router,) {
        Utilidades.translate = _translate;
        Utilidades.resolver = _resolver;
        Utilidades.http = _http;
        Utilidades.router = _router;
    }

    // Inicializar ws
    public static set_WS(_WebsocketService: WebsocketService){
        Utilidades.WebsocketService = _WebsocketService;
    }

    public static init_WS(enviarUsuario: boolean = true): WebsocketService
    {
        console.log('Init_WS');
        if(!ConfiGlobal.WebSocket_Enabled) return null;
        if(Utilidades.ObjectNull(Utilidades.WebsocketService)) return null;
        // if(!Utilidades.WebsocketService.Reconectar) return Utilidades.WebsocketService;   

        // PRUEBAS
        // let estado: boolean = false;
        // if(estado) {
        //     Utilidades.WebsocketService.connect(enviarUsuario);
        //     console.log('Estado conexión: ' + Utilidades.WebsocketService.ws.readyState);
        //     console.log('Conectado por reconexion');
        // }
        
        if(Utilidades.WebsocketService.ws.readyState === Utilidades.WebsocketService.ws.CLOSED) {
            Utilidades.WebsocketService.connect(enviarUsuario);
            console.log('Estado conexión: ' + Utilidades.WebsocketService.ws.readyState);
            console.log('Conectado por reconexion');

            // try {
            //     // if(Utilidades.isEmpty(Utilidades.CompActual)) return;
                // Utilidades.CompActual.Reconectar();
            //     console.log('Reconectar realizado');
            // } catch { }
        }
        else {
            console.log('ya conectado');
            // Utilidades.WebsocketService.Conectado = true;
            // Utilidades.WebsocketService.UserEnviado = true;
        }

        return Utilidades.WebsocketService;   
    }

    public static status_ws(): boolean{
        if(Utilidades.ObjectNull(Utilidades.WebsocketService)) return false;

        return Utilidades.WebsocketService.Conectado;
    }


    private static renderer: Renderer2;

    // comprobar error en frm-login
    public static compErrorLogin(error) {
        if (error.status === 401) {
            ConfiGlobal.mensajeError = 'Usuario o contraseña incorrecta.';
            ConfiGlobal.autorizacion = false;
        } 
        else if (error.status === 409) {
            ConfiGlobal.mensajeError = error.error.Error || 'Error interno del servidor.';
            ConfiGlobal.autorizacion = false;
        } 
        else if(error.status === 400){
            if(Utilidades.isEmpty(error.error))
                ConfiGlobal.mensajeError = 'Error interno del servidor.';
            else
                ConfiGlobal.mensajeError = error.error;
                
            ConfiGlobal.autorizacion = false;
        }
        else {
            ConfiGlobal.mensajeError = 'Ha surgido un error. Vuelve a intentarlo más tarde.';
            ConfiGlobal.autorizacion = false;
        }
        return ConfiGlobal.mensajeError;
    }

    // comprobar error en cada pantalla
    public static async compError(error, _router: Router, _pantalla: string) {
        setTimeout(() => {
            // La pantalla de carga (gris) se pone invisible al volver al login
            Utilidades.VarStatic.LPGenerico.instance.option("visible", false);
            _router.navigate(['']);
        }, 100);

        if(!Utilidades.isEmpty(error) && !Utilidades.isEmpty(error.error))
            Utilidades.MostrarErrorStr(error.error);
        else
            Utilidades.MostrarErrorStr('Ha surgido un error. Vuelva a iniciar sesión.');
            
        await Utilidades.escribirFicheroLog(error.message, _pantalla);

        // Utilidades.EscribirLog('Error en ' + _pantalla + ': ' + error);
        // notify('Ha surgido un error. Vuelva a iniciar sesión.', 'error', 4000);
    }

    // comprobar que las variables introducidas estén vacías
    public static isEmpty(val) {
        return (val === undefined || val === null || val.length <= 0) ? true : false;
    }

    public static ObjectNull(val) {
        try {
          if (val === undefined || val === null) return true;
          let strObj: string = '';
          try {
            strObj = JSON.stringify(val);
          } catch {
            strObj = '';
          }
          
          if (strObj === '{}') return true;
          else return false;
        } catch {
          return true;
        }
    }

    public static isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**
       * Obtiene la fecha y la hora actual
       * @param _addFecha Se indica si se quiere añadir la fecha
       * @param _addHora Se indica si se quiere añadir la hora
       * @param _addFechaLimpia Se indica si se quiere devolver solo la fecha sin barras
    */
    public static getFechaHoraActual(addFecha: boolean = true, addHora: boolean = true, addFechaLimpia: boolean = false): string {
        let date = new Date(); // year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number

        var anio = date.getFullYear().toString().substr(2, 3);
        var mes = ((date.getMonth() + 1).toString().length < 2) ? '0' + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        var dia = (date.getDate().toString().length < 2) ? '0' + date.getDate().toString() : date.getDate().toString();
        var horas = (date.getHours().toString().length < 2) ? '0' + date.getHours().toString() : date.getHours().toString();
        var min = (date.getMinutes().toString().length < 2) ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
        var sec = (date.getSeconds().toString().length < 2) ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
        var ms = (date.getMilliseconds().toString().length < 2) ? '0' + date.getMilliseconds().toString() : date.getMilliseconds().toString();
        ms = (ms.length < 3) ? '0' + ms : ms;
        
        var fecha = anio + '/' + mes + '/' + dia;
        var hora = horas + ':' + min + ':' + sec + ':' + ms;

        if(addFechaLimpia) {
            return anio + mes + dia;
        } else {
            let fechaHoraFinal = (addFecha ? fecha : '') + (addFecha ? ' ' : '')  + (addHora ? hora : '');
            return fechaHoraFinal;
        }
    }

    public static getHoraActual(): string {
        let date = new Date(); // year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number

        var horas = (date.getHours().toString().length < 2) ? '0' + date.getHours().toString() : date.getHours().toString();
        var min = (date.getMinutes().toString().length < 2) ? '0' + date.getMinutes().toString() : date.getMinutes().toString();
        var sec = (date.getSeconds().toString().length < 2) ? '0' + date.getSeconds().toString() : date.getSeconds().toString();
        var ms = (date.getMilliseconds().toString().length < 2) ? '0' + date.getMilliseconds().toString() : date.getMilliseconds().toString();
        ms = (ms.length < 3) ? '0' + ms : ms;
        
        var hora = horas + ':' + min + ':' + sec + ':' + ms;

        return hora;
    }

    public static BtnFooterUpdate(
        divPantalla: ElementRef, divContainer: ElementRef,
        divBtnFooter: ElementRef, ListaBotones: BotonPantalla[], render: Renderer2,
        ResizeBtn: boolean = true, btnSmall: boolean = false): void {

        try {
            this.renderer = render;

            const altoPantalla = divPantalla.nativeElement.offsetHeight;
            const altoContainer = divContainer.nativeElement.offsetHeight;
            // const diff = altoContainer - altoPantalla;
            const diff = window.innerHeight - altoPantalla;
    
            if(window.innerHeight >= TiposTamPantalla.HEIGHT_MIN)
                btnSmall = false;
    
            if (this.hayDosFilas(ListaBotones)) {
                if (diff > (ConfiGlobal.altoMinBotonesXS * 3) && !btnSmall) {
                    this.setAltura(ConfiGlobal.altoMaxBotonesXS + 'px', divBtnFooter);
    
                    if (window.innerWidth > TiposTamPantalla.XS_MAX || btnSmall) {
                        this.actualizarAlturas(ConfiGlobal.altoMaxBotonesXS, true, divBtnFooter, divContainer);
                    }
                    else {
                        this.actualizarAlturas(ConfiGlobal.altoMaxBotonesXS * 2, true, divBtnFooter, divContainer);
                    }
                }
                else {
                    this.setAltura(ConfiGlobal.altoMinBotonesXS + 'px', divBtnFooter);
                    if (window.innerWidth > TiposTamPantalla.XS_MAX && !btnSmall) {
                        this.actualizarAlturas(ConfiGlobal.altoMinBotonesXS, true, divBtnFooter, divContainer);
                    }
                    else {
                        this.actualizarAlturas((ConfiGlobal.altoMinBotonesXS * 2), true, divBtnFooter, divContainer);
                    }
                }
            }
            else {
                // && window.innerHeight < TiposTamPantalla.HEIGHT_MIN
                if ((diff > (ConfiGlobal.altoMinBotonesXS * 2) || !ResizeBtn) && window.innerHeight > TiposTamPantalla.HEIGHT_MIN) {
                    this.setAltura(ConfiGlobal.altoMaxBotonesXS + 'px', divBtnFooter);
                    this.actualizarAlturas(ConfiGlobal.altoMaxBotonesXS, false, divBtnFooter, divContainer);
                }
                else {
                    this.setAltura(ConfiGlobal.altoMinBotonesXS + 'px', divBtnFooter);
                    this.actualizarAlturas(ConfiGlobal.altoMinBotonesXS, false, divBtnFooter, divContainer);
                }
                // if (diff > (ConfiGlobal.altoMinBotonesXS * 2)) {
                //     this.setAltura(ConfiGlobal.altoMaxBotonesXS + 'px', divBtnFooter);
                //     this.actualizarAlturas(ConfiGlobal.altoMaxBotonesXS, false, divBtnFooter, divContainer);
                // }
                // else {
                //     this.setAltura(ConfiGlobal.altoMinBotonesXS + 'px', divBtnFooter);
                //     this.actualizarAlturas(ConfiGlobal.altoMinBotonesXS, false, divBtnFooter, divContainer);
                // }
            }
        } catch (Err){
            console.log(Err);
        }
    }

    private static hayDosFilas(ListaBotones: BotonPantalla[]): boolean {
        if (ListaBotones.length === 4 || ListaBotones.find(b => b.posicion === 4) !== undefined) {
            return true;
        }
        return false;
    }

    public static setAltura(altura: string, divBtnFooter: ElementRef) {
        if (divBtnFooter.nativeElement !== undefined
            && divBtnFooter.nativeElement.childNodes !== undefined
            && divBtnFooter.nativeElement.childNodes[0] !== undefined
            && divBtnFooter.nativeElement.childNodes[0].childNodes !== undefined
            && divBtnFooter.nativeElement.childNodes[0].childNodes[0] !== undefined
        ) {
            divBtnFooter.nativeElement.childNodes[0].childNodes[0].style.height = altura;
        }
    }
    private static actualizarAlturas(altura: number, dosFilas: boolean, divBtnFooter: ElementRef, divContainer: ElementRef) {
        this.renderer.setStyle(divBtnFooter.nativeElement, 'height', altura.toString() + 'px');
        const altoBtnFooter: number = divBtnFooter.nativeElement.offsetHeight;
        this.renderer.setStyle(divContainer.nativeElement, 'height', 'calc( 100% - ' + altoBtnFooter.toString() + 'px');
    }

    public static reconocerPantalla(): Pantalla {
        if (window.innerWidth <= TiposTamPantalla.SM_MIN) {
            return Pantalla.XS;
        }
        else if (window.innerWidth > TiposTamPantalla.SM_MIN && window.innerWidth <= TiposTamPantalla.MD_MIN) {
            return Pantalla.SM;
        }
        else if (window.innerWidth > TiposTamPantalla.MD_MIN && window.innerWidth <= TiposTamPantalla.LG_MIN) {
            return Pantalla.MD;
        }
        else if (window.innerWidth > TiposTamPantalla.LG_MIN && window.innerWidth <= TiposTamPantalla.XL_MIN) {
            return Pantalla.LG;
        }
        else if (window.innerWidth > TiposTamPantalla.XL_MIN) {
            return Pantalla.XL;
        }
    }

    public static comprobarBotonHrz(botonIcono: ElementRef, icono: ElementRef): boolean {
        var anchoBoton = botonIcono.nativeElement.offsetWidth;

        if (anchoBoton > 221) {
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';

            return true;
        } else if (anchoBoton < 220.98 && anchoBoton > 70) {
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';
            return false;
        } else if (anchoBoton < 69.98 && anchoBoton > 41) {
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';

            return false;
        } else if (anchoBoton < 40.98) {
            botonIcono.nativeElement.style.backgroundColor = 'transparent';
            icono.nativeElement.style.paddingLeft = '10px';
            botonIcono.nativeElement.style.border = 'transparent';

            return false;
        }
    }

    public static comprobarBotonVert(botonIcono: ElementRef, icono: ElementRef, texto: ElementRef, nroFilas: number): boolean {
        var anchoBoton = botonIcono.nativeElement.offsetWidth;

        if (anchoBoton > 221) {
            if(nroFilas === 3) {
                icono.nativeElement.style.paddingTop = '18px';
            } else {
                icono.nativeElement.style.paddingTop = '3px';
            }
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';
            botonIcono.nativeElement.style.height = '';
            icono.nativeElement.style.paddingBottom = '10px';
            return true;
        } else if (anchoBoton < 220.98 && anchoBoton > 70) {
            if(nroFilas === 3) {
                icono.nativeElement.style.paddingTop = '30px';
            } else {
                icono.nativeElement.style.paddingTop = '18px';
            }
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';
            botonIcono.nativeElement.style.height = '65px';
            icono.nativeElement.style.paddingBottom = '';
            return false;
        } else if (anchoBoton < 69.98 && anchoBoton > 41) {
            if(nroFilas === 3) {
                icono.nativeElement.style.paddingTop = '30px';
            } else {
                icono.nativeElement.style.paddingTop = '18px';
            }
            botonIcono.nativeElement.style.backgroundColor = '';
            icono.nativeElement.style.paddingLeft = '';
            botonIcono.nativeElement.style.border = '';
            botonIcono.nativeElement.style.height = '65px';
            icono.nativeElement.style.paddingBottom = '';
            return false;
        } else if (anchoBoton < 40.98) {
            if(nroFilas === 3) {
                icono.nativeElement.style.paddingTop = '30px';
            } else {
                icono.nativeElement.style.paddingTop = '18px';
            }
            botonIcono.nativeElement.style.backgroundColor = 'transparent';
            icono.nativeElement.style.paddingLeft = '10px';
            botonIcono.nativeElement.style.border = 'transparent';
            botonIcono.nativeElement.style.height = '65px';
            icono.nativeElement.style.paddingBottom = '';
            return false;
        }
    }

    public static comprobarPopUpGrid(popUp: DxPopupComponent, grid?: CmpDataGridComponent) {
        popUp.width = window.innerWidth - 20;
        popUp.height = window.innerHeight - 20;

        if(!Utilidades.ObjectNull(grid)) {
            grid.dgConfig.alturaMaxima = popUp.height - 85;
        }
    }

    public static comprobarPopUpGridBtnFooter(popUp: DxPopupComponent, grid: CmpDataGridComponent, divBtnFooter: ElementRef) {
        popUp.width = window.innerWidth - 20;
        popUp.height = window.innerHeight - 20;

        if(!Utilidades.ObjectNull(grid)) {
            grid.dgConfig.alturaMaxima = popUp.height - (60 + divBtnFooter.nativeElement.offsetHeight);
        }
    }

    /**
     * @param  {any} datos
     * @param  {boolean=false} guardarToken: si se indica a true es que guarda el token y el usuario
     * @returns boolean
     */
    public static DatosWSCorrectos(datos: any, guardarToken:boolean = false): boolean {

        let respuesta: RespuestaWebApi = datos;

        if(guardarToken){
            ConfiGlobal.Token = respuesta.token;
            ConfiGlobal.Usuario = respuesta.usuario;
        }
        // bien
        if (respuesta.resultado === ResultadoWebApi.OK) {
            // COMPROBAR SI HAY NOTIFICACIONES Y MOSTRAR EL POPUP
            // Utilidades.MostrarNotificacion(respuesta, divContainer);
            // RETURN TRUE, ??
            return true;
        }
        else if (respuesta.resultado === ResultadoWebApi.Fallo) {
            // BUSCAR ERROR EN TABLA
            // MOSTRARLO NOTIFY ??
            Utilidades.MostrarError(respuesta.nError);

            return false;
        } else if (respuesta.resultado === ResultadoWebApi.Excepcion) {
            Utilidades.MostrarErrorStr(respuesta.datos.Message);

            return false;
        } else {
            // MOSTRAR ERROR EN ALGUN SITIO, SOLICITUD FALLIDA
        }

    }

    private static RecuperarError(nError: number): string {
        //10100001

        if (nError === 0) return '';

        let keyError: string = 'nErrores.' + nError.toString();
        let strError = Utilidades.translate.instant(keyError)
        if (strError === keyError)
            return "";
        else
            return strError;

    }

    public static MostrarError(nError: number) {
        let strError = Utilidades.RecuperarError(nError)
        if (!Utilidades.isEmpty(strError)) {
            notify({position: { at: 'top center', my: 'top center', offset: '0 20'}, message: strError}, 'error', 3500);
        }
    }

    /**
     * Tipo de mensaje
     * @param info Aparece en azul
     * @param warning Aparece en amarillo como advertencia
     * @param error Aparece en rojo como error
     * @param success Aparece en verde como correcto
   */
    public static MostrarErrorStr(mensaje: string, tipo: string = 'error', duracion: number = 2000) {
        if (!Utilidades.isEmpty(mensaje)) {
            notify({position: { at: 'top center', my: 'top center', offset: '0 20'}, message: mensaje}, tipo, duracion);
        }
    }


    public static MostrarExitoStr(mensaje: string, tipo: string = 'success', duracion: number = 2000) {
        if (!Utilidades.isEmpty(mensaje)) {
            notify({position: { at: 'top center', my: 'top center', offset: '0 20'}, message: mensaje}, tipo, duracion);
        }
    }

    
    private static RecuperarNotificacion(nNotificacion: number): string {
        //10100001

        if (nNotificacion === 0) return '';

        let keyError: string = 'nNotificaciones.' + nNotificacion.toString();
        let strError = Utilidades.translate.instant(keyError)
        if (strError === keyError)
            return "";
        else
            return strError;

    }
    private static RecuperarBTNNotificacion(nNotificacion: number, btn: string): string {
        if (nNotificacion === 0) return '';

        let keyError: string = 'nNotificaciones.' + nNotificacion.toString() + '.' + btn;
        let strError = Utilidades.translate.instant(keyError)
        if (strError === keyError)
            return "";
        else
            return strError;

    }

    public static async establecerConexion(peticionSiguiente: string): Promise<boolean> {
        
        if (ConfiGlobal.HttpTimeWait === 0)
            return true;

        let Primera = true;
        this.VarStatic.VerIconoWifi = false;
        
        let headers = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ConfiGlobal.Token,
                'IdEstablecerConexion': Utilidades.getFechaHoraActual()
            })
        };

        const body = { usuario : ConfiGlobal.Usuario, next: peticionSiguiente };

        try {
            let inicio = new Date().getTime();
            let conectado = false;
      
            while (!conectado){
                let result= null;
        
                /*
                    -- OJO!
                    -- cuando se esta depurando, como la peticion del timeout son 3 segundos, se pierde el token 
                */
                try {
                    let tm = Primera ? 4000: 15000;
                    result = await this.http.post(ConfiGlobal.URL + '/api/principal/Connection', body, headers)
                            .pipe(timeout(tm)).toPromise();
                
                    Utilidades.DatosWSCorrectos(result, true);
                } catch(e) {

                    Primera = false;

                    Utilidades.EscribirLog('Session: '+ ConfiGlobal.sessionId +', Intento de conexion fallido, Status: '+  e.status);
                    Utilidades.escribirFicheroLog('Session: '+ ConfiGlobal.sessionId +', Intento de conexion fallido, Status: '+  e.status, peticionSiguiente);
                    
                    console.log(e);
                    console.log('----> ' + e.status);
                    if (e.status === 401){
                        Utilidades.EscribirLog('Session: '+ ConfiGlobal.sessionId +', Session fallida');
                        Utilidades.escribirFicheroLog('Session: '+ ConfiGlobal.sessionId +', Session fallida', peticionSiguiente);

                        try {
                            if(ConfiGlobal.LOG.length > 0)
                                await this.http.post(ConfiGlobal.URL + '/api/login/SendLog', {LogData: Utilidades.RecuperarLog(),}, Utilidades.getHeaders(false)).toPromise();
                        } catch { }
                        
                      
                        this.VarStatic.VerIconoWifi = false;
                        Utilidades.compError({error: 'Sesión caducada'}, this.router, 'Conexion');
                        return false;
                    }
                    this.VarStatic.VerIconoWifi = true;
                }
        
                if (result !== null && result.datos === true) {
                    if(!Primera) {
                        Utilidades.EscribirLog('Session: '+ ConfiGlobal.sessionId +', Reconexion realizada');
                        Utilidades.escribirFicheroLog('Session: '+ ConfiGlobal.sessionId +', Reconexion realizada', peticionSiguiente);
                    }

                    this.VarStatic.VerIconoWifi = false;
                    break;
                }
                else{
                    // Si entra por aqui no hay conexion, mostrar icono de wifi

                    Primera = false;

                    Utilidades.EscribirLog('Session: '+ ConfiGlobal.sessionId +', Reintentando conexion');
                    Utilidades.escribirFicheroLog('Session: '+ ConfiGlobal.sessionId +', Reintentando conexion', peticionSiguiente);
    
                    this.VarStatic.VerIconoWifi = true;
                    await this.delay(2000);

                    // Comprobar si ha llegado el timeout de espera para la reconexion
                    if((new Date().getTime() - inicio) > ConfiGlobal.HttpTimeWait){
                        this.VarStatic.VerIconoWifi = false;
                        Utilidades.compError({error: 'Sesión caducada'}, this.router, 'Conexion');
                        return false;
                    }
                }
            }
        } catch { }

        // Comprobar conexion del ws
        try {
            if(!Utilidades.status_ws())
                Utilidades.init_WS();
        } catch { }

        return true;
    }

    //EAN128
    public static EAN128 =
    { 
        ObtenerPalet(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.SSCC)) return codigo;

                return datos.SSCC;
            } catch {
                return null;
            }
        },
        ObtenerEAN(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                if(datos === null) return codigo;

                // Esta llegando en datos: {ArticuloAgrupacionContenido: "8435183912147"}
                // Por lo que no está llegando el "ArticuloAgrupacion"
                // Esto significa que está montado para que funcione con el "ArticuloAgrupacion" y no con el "ArticuloAgrupacionContenido"
                // Entonces hay que ver si también llega vacío el "ArticuloAgrupacionContenido"
                // Y se devuelve el que venga relleno
                if (Utilidades.isEmpty(datos.ArticuloAgrupacion) && Utilidades.isEmpty(datos.ArticuloAgrupacionContenido)) return codigo;

                if(!Utilidades.isEmpty(datos.ArticuloAgrupacion))
                    return datos.ArticuloAgrupacion;
                else
                    return datos.ArticuloAgrupacionContenido;

            } catch {
                return null;
            }
        },
        ObtenerLote(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.Lote)) return codigo;

                return datos.Lote;
            } catch {
                return null;
            }
        },
        ObtenerCaducidad(codigo: string): any {
            try {
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.FechaCaducidad)) return codigo;

                return datos.FechaCaducidad;
            } catch {
                return null;
            }
        },
        ObtenerCantidad(codigo: string): any {
            try {
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.CantidadContenido)) return codigo;

                return datos.CantidadContenido;
            } catch {
                return null;
            }
        },
        Obtener(codigo: string): GS1DATOSDECO {
            try {  
                let datos = GS1DATOSDECO.decodificarEan128(codigo);
                datos.TipoLectura = TipoLectura.EAN128;

                if(Utilidades.isEmpty(datos.ArticuloAgrupacion))
                    datos.ArticuloAgrupacion = datos.ArticuloAgrupacionContenido;
                
                if(Utilidades.isEmpty(datos.FechaCaducidad))
                    datos.FechaCaducidad = datos.FechaConsumoPreferente;

                return datos;
            } catch {
                return null;
            }
        },
        QuitarPrefijos(codigo: string): string {
            try {  
                //quitar todos los prefijos 
                ConfiGlobal.PrefijosEAN128.forEach((p) => {
                  if (codigo.substr(0, 3) === p)
                    codigo = codigo.substr(3, codigo.length);
                 
                });
                if (codigo.substr(0, 1) === ConfiGlobal.CharEAN128)
                codigo = codigo.substr(1, codigo.length);
                
                return codigo;
            } catch {
                return codigo;
            }
        },
    }

    public static QR =
    { 
        ObtenerPalet(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.SSCC)) return codigo;

                return datos.SSCC;
            } catch {
                return null;
            }
        },
        ObtenerEAN(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.ArticuloAgrupacion)) return codigo;

                return datos.ArticuloAgrupacion;
            } catch {
                return null;
            }
        },
        ObtenerLote(codigo: string): string {
            try {
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.Lote)) return codigo;

                return datos.Lote;
            } catch {
                return null;
            }
        },
        ObtenerCaducidad(codigo: string): any {
            try {
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.FechaCaducidad)) return codigo;

                return datos.FechaCaducidad;
            } catch {
                return null;
            }
        },
        ObtenerCantidad(codigo: string): any {
            try {
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                if(datos === null) return codigo;

                if (Utilidades.isEmpty(datos.CantidadContenido)) return codigo;

                return datos.CantidadContenido;
            } catch {
                return null;
            }
        },
        Obtener(codigo: string): GS1DATOSDECO {
            try {  
                let datos = GS1DATOSDECO.decodificarQR(codigo);
                datos.TipoLectura = TipoLectura.QR;

                if(Utilidades.isEmpty(datos.ArticuloAgrupacion))
                    datos.ArticuloAgrupacion = datos.ArticuloAgrupacionContenido;
                
                if(Utilidades.isEmpty(datos.FechaCaducidad))
                    datos.FechaCaducidad = datos.FechaConsumoPreferente;
                    
                return datos;
            } catch {
                return null;
            }
        },
        QuitarPrefijos(codigo: string): string {
            try {  
                //quitar todos los prefijos 
                ConfiGlobal.PrefijosQR.forEach((p) => {
                  if (codigo.substr(0, 3) === p)
                    codigo = codigo.substr(3, codigo.length);
                 
                });
                if (codigo.substr(0, 1) === ConfiGlobal.CharQR)
                codigo = codigo.substr(1, codigo.length);
                
                return codigo;
            } catch {
                return codigo;
            }
        },

    }


    public static getHeaders(conToken: boolean = true) {

        let headers = null;
        if (conToken) {

            headers = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + ConfiGlobal.Token
                })
            };
        }
        else {
            headers = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                }),
            };
        }


        return headers;
    }


    /** Crea un dialog por notificacion */
    private static DialogNotificacion(nNotify: number, titulo: string = '', tipo?: TipoDialogo): any {        
        let strNotificacion = Utilidades.RecuperarNotificacion(nNotify);
        let btnOK = Utilidades.RecuperarBTNNotificacion(nNotify, 'OK');
        let btnYES = '';
        let btnNO = '';

        if (Utilidades.isEmpty(btnOK)) {
            btnYES = Utilidades.RecuperarBTNNotificacion(nNotify, 'YES');
            btnNO = Utilidades.RecuperarBTNNotificacion(nNotify, 'NO');            
        }
        if (Utilidades.isEmpty(strNotificacion) && (Utilidades.isEmpty(btnOK) || (Utilidades.isEmpty(btnYES) && Utilidades.isEmpty(btnNO))))
            return null;
          
        if (!Utilidades.isEmpty(btnOK)) {
            if ( (tipo===null) || (tipo===undefined) ) {
                tipo=TipoDialogo.error;
            }
            strNotificacion = this.maquetaMensageDialog(strNotificacion,tipo);               
            return Utilidades.DialogMessageOK(strNotificacion, titulo, btnOK) ;
        }
        if (!Utilidades.isEmpty(btnYES) && !Utilidades.isEmpty(btnNO)) {
            if ( (tipo===null) || (tipo===undefined) ) {
                tipo=TipoDialogo.confirmacion;
            }
            strNotificacion = this.maquetaMensageDialog(strNotificacion,tipo);            
            return Utilidades.DialogMessageYESNO(strNotificacion, titulo, btnYES, btnNO);
        }
    }

    private static DialogMessage(mensaje: string, titulo: string = '', btns: Array<string> = []): any {
        // titulo -> recuperar de traducir
        let myDialog = custom({
            title: titulo,
            messageHtml: mensaje,
            dragEnabled: false,
            showTitle: !Utilidades.isEmpty(titulo),
            buttons: [
                {
                    text: "SI", // obtener de traducion
                    onClick: (e) => {
                        return true;
                    }
                },
                {
                    text: "NO", // obtener de traducion
                    onClick: (e) => {
                        return false;
                    }
                },
            ]
        });

        return myDialog;

    }

    private static DialogMessageOK(mensaje: string, titulo: string = '', btnOK: string): any {
        // titulo -> recuperar de traducir
        let myDialog = custom({
            title: titulo,
            messageHtml: mensaje,
            dragEnabled: false,
            showTitle: !Utilidades.isEmpty(titulo),
            buttons: [
                {
                    text: btnOK,
                    onClick: (e) => {
                        return true;
                    },
                },
            ],
        });

        return myDialog;
    }

    private static DialogMessageYESNO(mensaje: string, titulo: string = '', btnYES: string, btnNO: string): any {
        // titulo -> recuperar de traducir
        let myDialog = custom({
            title: titulo,
            messageHtml: mensaje,
            dragEnabled: false,
            showTitle: !Utilidades.isEmpty(titulo),
            buttons: [
                {
                    text: btnYES, // obtener de traducion
                    onClick: (e) => {
                        return true;
                    }
                },
                {
                    text: btnNO, // obtener de traducion
                    onClick: (e) => {
                        return false;
                    }
                },
            ]
        });

        return myDialog;
    }

    public static ShowDialogString(mensaje: string, titulo: string = '', tipo?: TipoDialogo ): any {
        return new Promise(resolve => {
            
            if ( (tipo===null) || (tipo===undefined) ) {tipo=TipoDialogo.confirmacion}
            mensaje = this.maquetaMensageDialog(mensaje,tipo);            
            
            let myDialog = Utilidades.DialogMessage(mensaje, titulo);
            myDialog.show().then((dialogResult) => {
                resolve(dialogResult);
            });
        });
    }

    public static ShowDialogAviso(mensaje: string, titulo: string = '', tipo?: TipoDialogo): any {
        return new Promise(resolve => {
            
            if ( (tipo===null) || (tipo===undefined) ) {tipo=TipoDialogo.aviso}
            mensaje = this.maquetaMensageDialog(mensaje,tipo);
            
            let myDialog = Utilidades.DialogMessageOK(mensaje, titulo,'OK');
            myDialog.show().then((dialogResult) => {
                resolve(dialogResult);
            });
        });
    }

    public static ShowDialogInfo(mensaje: string, titulo: string = '', tipo?: TipoDialogo): any {
        return new Promise(resolve => {
            
            if ( (tipo===null) || (tipo===undefined) ) {tipo=TipoDialogo.info}
            mensaje = this.maquetaMensageDialog(mensaje,tipo);
            
            let myDialog = Utilidades.DialogMessageOK(mensaje, titulo,'OK');
            myDialog.show().then((dialogResult) => {
                resolve(dialogResult);
            });
        });
    }

    public static ShowDialogNotify(nNotify: number, titulo: string = '', tipo?: TipoDialogo): any {
        return new Promise(resolve => {
            let myDialog = Utilidades.DialogNotificacion(nNotify, titulo, tipo);
            myDialog.show().then((dialogResult) => {
                resolve(dialogResult);
            });
        });
    }

    public static ShowDialogPopUp(mensaje: string, titulo: string = '', tipo?: TipoDialogo): any {
        return new Promise(resolve => {

            if ( (tipo===null) || (tipo===undefined) ) {tipo=TipoDialogo.info}
            mensaje = this.maquetaMensageDialog(mensaje,tipo);

            let myDialog = Utilidades.DialogMessage(mensaje, titulo);
            myDialog.show().then((dialogResult) => {
                resolve(dialogResult);
            });
        });
    }

    static maquetaMensageDialog (mensaje: string, tipo:TipoDialogo): string {
        let icono : string;
        switch (tipo) {
            case TipoDialogo.confirmacion : {
                // uso fontawesome
                //icono = '<i class="fas fa-question-circle fa-3x"></i>';
                // uso bootstrap
                icono = '<i class="bi bi-question-circle" style="font-size:3rem;"></i>';
                break;
            }
            case TipoDialogo.error : {
                // uso fontawesome
                //icono = '<i class="fas fa-times-circle fa-3x" style="color:red"></i>'
                // uso bootstrap
                icono = '<i class="bi bi-x-circle" style="font-size:3rem; color:red;"></i>';
                break;
            }            
            case TipoDialogo.aviso : {
                // uso fontawesome
                //icono = '<i class="fas fa-exclamation-circle fa-3x"></i>'
                // uso bootstrap
                icono = '<i class="bi bi-exclamation-circle" style="font-size:3rem;"></i>';
                break;
            }
            case TipoDialogo.info : {
                // uso fontawesome
                //icono = '<i class="fas fa-info-circle fa-3x"></i>'
                // uso bootstrap
                icono = '<i class="bi bi-info-circle" style="font-size:3rem;"></i>';
                break;
            }
            default : {
                icono = '';
                break;
            }
        }   

        let html:string;
        html = '<table><tr>'
             + '<td>'+icono+'</td>'
             + '<td>&nbsp;&nbsp;</td>'
             + '<td>'+mensaje+'</td>'
             + '</tr></table>';                 
        return html;
    }
    static miDatePipe: DatePipe;
    public static EscribirLog(info: string) {
        try {
            var fechaHora = Utilidades.getFechaHoraActual();

            ConfiGlobal.LOG.push(fechaHora + ' - User: ' + ConfiGlobal.Usuario + ' - ' + info);
            console.log(fechaHora + ' - User: ' + ConfiGlobal.Usuario + ' - ' + info);
        } catch (error) { }
    }

    public static RecuperarLog(): string[]
    {
        try {
            let copy = ConfiGlobal.LOG;
            ConfiGlobal.LOG = [];
            return copy;
        } catch (error) { }
    }

    public static MostrarLog() {
        ConfiGlobal.LOG.forEach(element => {
            console.log(element);
        });
    }


    public static DevolverFoco(componenteFoco: any, comprobacion: boolean): boolean {
        // return false;

        if (!comprobacion) {
            componenteFoco.instance.focus();
            return true;
        }
        else {
            return false;
        }
    }

    public static ComprobarUltimoFoco(CompValidar: any, comprobacion: boolean): boolean {
        // return false;

        if (comprobacion) {
            CompValidar.instance.focus();
            return true;
        }
        else {
            return false;
        }
    }

    // variables necesarias entre pantallas
    public static VarStatic =
    {
        Filtros: null,
        PaletCompleto: false,
        LoadPrincipal: false,
        ClickNoPeticion: false,
        LPGenerico: null,
        VerIconoWifi: false
    }

    public static Validacion =
    {
        Generica(cadena: string, pantalla?: string) {
            try {
                Utilidades.escribirFicheroLog(cadena, Utilidades.isEmpty(pantalla)?'Util. Valid. Generica': pantalla);
                if(cadena.substr(0, 1) === ']' && cadena.length > 3) {
                    return cadena.substr(3, cadena.length);
                } else {
                   return cadena; 
                }
            } catch {
                return cadena;
            }
        },
        Palet(cadena: string) {
            try {
                let palet = Utilidades.EAN128.ObtenerPalet(cadena);
                if(palet !== cadena) return palet;

                palet = Utilidades.QR.ObtenerPalet(cadena);
                if(palet !== cadena) return palet;

                if(cadena.substr(0, 1) === ']' && cadena.length > 3) {
                    return cadena.substr(3, cadena.length);
                } else {
                    return cadena; 
                }
            } catch {
                return cadena;
            }
        },
        Lote(cadena: string) {
            try {
                let lote = Utilidades.EAN128.ObtenerLote(cadena);
                if(lote !== cadena) return lote;

                lote = Utilidades.QR.ObtenerLote(cadena);
                if(lote !== cadena) return lote;

                if(cadena.substr(0, 1) === ']' && cadena.length > 3) {
                    return cadena.substr(3, cadena.length);
                } else {
                    return cadena; 
                }
            } catch {
                return cadena;
            }
        },
        Articulo(cadena: string) {
            try {
                let ean = Utilidades.EAN128.ObtenerEAN(cadena);
                if(ean !== cadena) return ean;

                ean = Utilidades.QR.ObtenerEAN(cadena);
                if(ean !== cadena) return ean;

                if(cadena.substr(0, 1) === ']' && cadena.length > 3) {
                    return cadena.substr(3, cadena.length);
                } else {
                    return cadena; 
                }
            } catch {
                return cadena;
            }
        },
        Datos(cadena: string, PrimeroQR: boolean = false) {
            try {
                let datos = null;
                if(PrimeroQR)
                {
                    datos = Utilidades.QR.Obtener(cadena);
                    if (!Utilidades.ObjectNull(datos)) {
                        datos.CadenaOrigen = cadena;
                        return datos;
                    }
                }

                datos = Utilidades.EAN128.Obtener(cadena);

                if (!Utilidades.ObjectNull(datos)) {
                  datos.CadenaOrigen = cadena;
                  return datos;
                }

                datos = Utilidades.QR.Obtener(cadena);
                if (!Utilidades.ObjectNull(datos)) {
                  datos.CadenaOrigen = cadena;
                  return datos;
                }

                let dt: GS1DATOSDECO = new GS1DATOSDECO();
                dt.TipoLectura = TipoLectura.NULL;
                dt.CadenaOrigen = Utilidades.Validacion.Generica(cadena);
                return dt;
            } catch {
                let dt: GS1DATOSDECO = new GS1DATOSDECO();
                dt.CadenaOrigen = Utilidades.Validacion.Generica(cadena);
                dt.TipoLectura = TipoLectura.NULL;
                return dt;           
            }
        }
    }

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /*** Metodo para actualizar la altura de los grid ***/
    // nGrids numero de grids (2 grids)¡Poner altura inicial a 0 para ajustar bien!!
    public static ActualizarAlturaGrid(
        divContainer: ElementRef, divPantalla: ElementRef,divFooter: ElementRef, alturaActual: number, nGrids: number = 1): number {

        const altoPantalla = divPantalla.nativeElement.offsetHeight;
        const altoContainer = divContainer.nativeElement.offsetHeight;
        const altoBotones = divFooter.nativeElement.offsetHeight;
        const diff = altoPantalla - altoContainer;

        const separacionMin: number = 0;

        if (diff > separacionMin) {
            //actualizar grids
            return (diff + alturaActual)/nGrids;
        }
        else
        {
            return (alturaActual + diff)/nGrids;
        }
    }

    /*** Metodo para actualizar la altura de los TextArea ***/
    public static ActualizarAlturaTextArea(
        divPantalla: ElementRef, divContainer: ElementRef, divFooter: ElementRef, alturaActual: number): number {

        const altoPantalla = divPantalla.nativeElement.offsetHeight;
        const altoContainer = divContainer.nativeElement.offsetHeight;
        const altoBotones = divFooter.nativeElement.offsetHeight;
        const diff = altoPantalla - altoContainer;

        const separacionMin: number = 0;

        if (diff > separacionMin) {
            //actualizar grids
            return (diff + alturaActual);
        }
        else
        {
            return (alturaActual + diff);
        }
    }

    public static RecuperarConfiGrid(dt: any): Array<any> {
        try {    
            if(dt.length === 0) return [];
            let separador: string = ConfiGlobal.SeparadorGrid;
    
            let cols: Array<ColumnDataGrid> = [];
            let colsAntiguas: Map<string, string> = new Map<string, string>();
    
            for (const col in dt[0]) {
                if(!col.includes(separador)) {
                    return [];
                }
    
                var opt: Array<string> = col.split(separador);
                var c: ColumnDataGrid = new ColumnDataGrid();
    
                for (const item of opt) {
    
                    var valor: string = "";
                    if (item.startsWith("0_")) {
                        valor = item.replace("0_", "");
                        colsAntiguas.set(valor, col);
                        c.dataField = valor;
                    } else if (item.startsWith("1_")) {
                        valor = item.replace("1_", "");
                        c.caption = valor;
                    } else if (item.startsWith("2_")) {
                        valor = item.replace("2_", "");
                        c.visible = valor === "1"? true: false;
                    } else if (item.startsWith("4_")) {
                        valor = item.replace("4_", "");
    
                        let tipo = valor.split('_')[0];
                        let orden = valor.split('_')[1];
    
                        c.sortOrder = tipo === '1'? 'asc': 'desc';
                        c.sortIndex = parseInt(orden);
                    }
                    /* } else if (item.startsWith("3_")) {
                        valor = item.replace("3_", "");
                        colCombos.Add(c.Ordinal, valor); 
                    } else if (item.startsWith("5_")) {
                        valor = item.Replace("5_", "");
                        valor = string.Format("Execute {0} {1}, '{2}'", valor, Convert.ToInt32(PantallasPedidos.Consolidacion), c.ColumnName);
                        cargarCellStyle(valor);
                    } */
                } 
                cols.push(c);
            }
    
            colsAntiguas.forEach((v, k, e) => {
                dt = JSON.parse(JSON.stringify(dt).split('"'+v+'":').join('"'+k+'":'));
            });
    
            var datosDevolver: Array<any> = [];
            datosDevolver.push(cols, dt);
    
            return datosDevolver;
        } catch {
            return [];    
        }
    }

    // Mapear el DataGrid a objeto (columnas dinámicas)
    public static MapearObjeto(dt: any): Array<any> {
        try {    
            if(dt.length === 0) return [];
            let separador: string = ConfiGlobal.SeparadorGrid;
    
            let cols: Array<ColumnDataGrid> = [];
            let colsAntiguas: Map<string, string> = new Map<string, string>();
    
            for (const col in dt[0]) {
                if(!col.includes(separador)) {
                    return dt;
                }
    
                var opt: Array<string> = col.split(separador);
                var c: ColumnDataGrid = new ColumnDataGrid();
    
                for (const item of opt) {
    
                    var valor: string = "";
                    if (item.startsWith("0_")) {
                        valor = item.replace("0_", "");
                        colsAntiguas.set(valor, col);
                        c.dataField = valor;
                    } else if (item.startsWith("1_")) {
                        valor = item.replace("1_", "");
                        c.caption = valor;
                    } else if (item.startsWith("2_")) {
                        valor = item.replace("2_", "");
                        c.visible = valor === "1"? true: false;
                    } else if (item.startsWith("4_")) {
                        valor = item.replace("4_", "");
    
                        let tipo = valor.split('_')[0];
                        let orden = valor.split('_')[1];
    
                        c.sortOrder = tipo === '1'? 'asc': 'desc';
                        c.sortIndex = parseInt(orden);
                    }
                } 
                cols.push(c);
            }

            if(cols.length === 0)
                return dt;
    
            colsAntiguas.forEach((v, k, e) => {
                dt = JSON.parse(JSON.stringify(dt).split('"'+v+'":').join('"'+k+'":'));
            });
    
            return dt;
        } catch {
            return dt;    
        }
    }

    public static async leerFicheroConexion(mostrarDatos: boolean = true): Promise<Conexion> {
        // const fsWeb = require('fs-web');
        const conex: Conexion = new Conexion();
        await fs.readString('archivos/conexion.json').then((res) => {
            if(mostrarDatos)
                Utilidades.MostrarErrorStr('Tipo: ' + res.TipoConexion + ' | IP: ' + res.IP + ' | Puerto: ' + res.Puerto, 'info', 3500);
                // notify('Tipo: ' + res.TipoConexion + ' | IP: ' + res.IP + ' | Puerto: ' + res.Puerto, 'info', 3500);
        
            conex.IP = res.IP;
            conex.Puerto = res.Puerto;
            conex.TipoConexion = res.TipoConexion;
            conex.Conexion = res.TipoConexion + '://' + res.IP + ':' + res.Puerto;
        });
        return conex;
    }

    public static async leerFicheroLogin(mostrarDatos: boolean = true): Promise<Login> {
        // const fsWeb = require('fs-web');
        const login: Login = new Login();
        await fs.readString('archivos/login2.json').then((res) => {
            if(mostrarDatos)
                Utilidades.MostrarErrorStr('Usuario: ' + res.Usuario + ' | Password: ' + res.Password + ' | Recuérdame: ' + res.Recuerdame, 'info', 3500);
                // notify('Usuario: ' + res.Usuario + ' | Password: ' + res.Password + ' | Recuérdame: ' + res.Recuerdame, 'info', 3500);
        
            login.Usuario = res.Usuario;
            login.Password = res.Password;
            login.Recuerdame = res.Recuerdame;
        });
        return login;
    }

    public static async leerFicheroLog(nombreLog): Promise<Array<Log>> {
        // const fsWeb = require('fs-web');
        var arrayInfoLog: Array<Log> = new Array<Log>();
        await fs.readString('archivosLog/' + nombreLog).then((res) => {
            arrayInfoLog = res;
        });

        return arrayInfoLog;
    }

    public static async escribirFicheroLog(descripcion: string, Pantalla:string) {
        try {
            let infoNueva: any = {
                'Descripcion' : descripcion,
                'Fecha' : Utilidades.getFechaHoraActual(),
                'Hora' : Utilidades.getHoraActual(),
                'Pantalla': Pantalla,
                'Usuario': ConfiGlobal.Usuario || 1
            }
    
            // const fsWeb = require('fs-web');
            var nombreLog = 'LogTerminal_' + Utilidades.getFechaHoraActual(false, false, true) + '.json';
            var arrayLog: Array<Log>;
            try {
                // Se lee el fichero (si existe) para guardar su contenido de nuevo
                arrayLog = await Utilidades.leerFicheroLog(nombreLog);
            } catch {
            }
    
            var arrayJSON: Array<JSON> = new Array<JSON>();
            // Se añade lo leído en el fichero a un array de JSON
            if(!Utilidades.isEmpty(arrayLog)) {
                arrayLog.forEach(element => {
                    let datosLog: any = {
                        'Descripcion' : element.Descripcion,
                        'Fecha' : element.Fecha,
                        'Hora' : element.Hora,
                        'Pantalla': element.Pantalla,
                        'Usuario': element.Usuario
                    }
                    let log: JSON = datosLog;
                    arrayJSON.push(log);
                });
            }
    
            // Se añade también a este array la nueva info a introducir
            if(!Utilidades.isEmpty(infoNueva)) {
                let log: JSON = infoNueva;
                arrayJSON.push(log);
            }
    
            if(!Utilidades.isEmpty(arrayJSON)) {
                // Se escribe el fichero con el array
                await fs.writeFile('archivosLog/' + nombreLog, arrayJSON).then(async () => {/* await Utilidades.delay(3000); */}).catch((err) => {console.log(err);});
            } else {
                Utilidades.MostrarErrorStr('No se ha podido escribir el Log - Datos vacíos');
            }
        } catch { }
        
    }

    public static LOG =
    {
        ConsoleTime(txt: string){
            let date = new Date();
            console.log(date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + 
            date.getSeconds().toString() + ':' + date.getMilliseconds().toString() + ' ----- ' + txt);
        },
        NotifyTime(txt: string){
            let date = new Date();
            notify(date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + 
            date.getSeconds().toString() + ':' + date.getMilliseconds().toString() + ' ----- ' + txt);
        },
    }

    public static FormatPaletToNumber(palet: string): string {
        if (palet === undefined || palet === null || palet.length === 0) return '';

        let str1 = palet.substring(0,9);
        if(isNaN(Number(str1)))
            return '';

        let str2 = palet.substring(9);
        if(isNaN(Number(str2)))
            return '';

        let pal1 = parseInt(str1);
        let pal2 = pal1 === 0 ? parseInt(str2).toString() : str2;
        return (pal1 === 0 ? pal2 : pal1.toString() + pal2);
    }

    public static FormatContendorToNumber(contenedor: string, tipo: TipoDocumento): string {
        if (contenedor === undefined || contenedor === null || contenedor.length === 0) return '';
        
        // posible formato dependiendo del tipo documento. por ahora solo tarea conversion str2int
        if(isNaN(Number(contenedor)))
            return '';
        else
            return  parseInt(contenedor).toString();
    }

    public static validacionFechaDDMMYYYY(strFecha): Date {
        let fechaComprobada: Date = null;
        if(Utilidades.isEmpty(strFecha)) return null;
    
        if(strFecha.length !== 8) {
          return null;
        }
    
        var vregexNaix = /^(?:(?:(?:0?[1-9]|1\d|2[0-8])[/](?:0?[1-9]|1[0-2])|(?:29|30)[/](?:0?[13-9]|1[0-2])|31[/](?:0?[13578]|1[02]))[/](?:0{2,3}[1-9]|0{1,2}[1-9]\d|0?[1-9]\d{2}|[1-9]\d{3})|29[/]0?2[/](?:\d{1,2}(?:0[48]|[2468][048]|[13579][26])|(?:0?[48]|[13579][26]|[2468][048])00))$/; 
        if(!vregexNaix.test(strFecha.substr(0, 2) + '/' + strFecha.substr(2, 2) + '/' + strFecha.substr(4, 4))){
          return null;
        } 

        fechaComprobada = new Date(Date.UTC(parseInt(strFecha.substr(4, 4)), parseInt(strFecha.substr(2, 2)) - 1, parseInt(strFecha.substr(0, 2))));
        
        return fechaComprobada;    
    }

    
    // oscurecer la pantalla en la peticion,
    public static VerLPGenerico(valor : boolean)
    {
        Utilidades.VarStatic.LPGenerico.instance.option("visible", valor);
    }



    public static validacionFechaDDMMYY(strFecha): Date {
        let fechaComprobada: Date = null;
        if(Utilidades.isEmpty(strFecha)) return null;
    
        if(strFecha.length !== 6) {
          return null;
        }
        // insertamos 2 digitos año 2000
        strFecha= strFecha.substr(0, 4)+'20'+strFecha.substr(4,2);

        return this.validacionFechaDDMMYYYY(strFecha);
    }    

    public static navegarLogin() {
        Utilidades.router.navigate(['']);
        // Quitar fondo de carga gris
        Utilidades.VerLPGenerico(false);
    }


    // A esta funcion se le pasa el parametro en formato fecha dd/mm/yyyy o dd-mm-yyyy ambos son aceptados

    public static semanadelano($fecha){
        // Constantes para el calculo del primer dia de la primera semana del año
        let cons: Array<number>  =  [2,1,7,6,5,4,3]; 
        
        // Permitimos que el parametyro fecha este separada por "/" al remplazarlas por "-" mediante .replace y el uso de expresiones regulares
        if ($fecha.match(/\//)){
        $fecha   =  $fecha.replace(/\//g,"-",$fecha);
        };

        // Partimos la fecha en trozos para obtener dia, mes y año por separado    
        $fecha  =  $fecha.split("-");
        let dia = eval($fecha[0]);
        let mes = eval($fecha[1]);
        let ano = eval($fecha[2]);   
        // Convertimos el mes a formato javascript 0=enero
        if (mes!==0) { mes--; };
        
        // Obtenemos el dia de la semana del 1 de enero
        let dia_pri: number  =  new Date(ano,0,1).getDay();; 
        // Obtenemos el valor de la constante correspondiente al día    
        dia_pri = cons[dia_pri];
        // Establecemos la fecha del primer dia de la semana del año
        let tiempo0 : Date  =  new Date(ano,0,dia_pri);
        // Sumamos el valor de la constante a la fecha ingresada para mantener los lapsos de tiempo
        dia = (dia+dia_pri);
        // Obtenemos la fecha con la que operaremos
        let tiempo1 : Date  =  new Date(ano,mes,dia);        
        // Restamos ambas fechas y obtenemos una marca de tiempo
        let lapso = (tiempo1.getTime() - tiempo0.getTime());       
        // Dividimos la marca de tiempo para obtener el numero de semanas
        let semanas  =  Math.floor(lapso/1000/60/60/24/7);
        // Si el 1 de enero es lunes le sumamos 1 a la semana caso contrarios el calculo nos daria 0 y nos presentaria la semana como semana 52 del año anterior
        if (dia_pri == 1) { 
            semanas++; 
        };
        // Establecemos que si el resultado de semanas es 0 lo cambie a 52 y reste 1 al año esto funciona para todos los años en donde el 1 de Enero no es Lunes
        if (semanas == 0) {
            semanas=52;
            ano--;
        };

        // Con esta sentencia arrojamos el resultado. Esta ultima linea puede ser cambiada a gusto y conveniencia del lector          
        alert(semanas);
    };

    // TRUE - ARTICULO MULTIPLE
    // FALSE - ARTICULO UNICO
    public static comprobarArticuloUnico(objDatos: any): boolean {
        try {
            if(!Utilidades.isEmpty(objDatos.SelectArticulo))
                return true;
            else
                return false;
        } catch {
            return false;
        }
    }

  
    public static generarId(lenght: number = 10) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < lenght; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
      
}
