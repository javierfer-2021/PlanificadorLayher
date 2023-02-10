import { CmpTextBoxComponent } from './../../Componentes/cmp-text-box/cmp-text-box.component';
import { Component, OnInit, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import notify from 'devextreme/ui/notify';
import { DxPopupComponent } from 'devextreme-angular';
import { timeout } from 'rxjs/operators';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { DataTextBoxConfig } from '../../Clases/DataTextBoxConfig';
import { Utilidades } from '../../Utilidades/Utilidades';
import { environment } from '../../../environments/environment';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { PeticionesGeneralesService } from '../../Servicios/PeticionesGeneralesService/peticiones-generales.service';
import { WebsocketService } from '../../Servicios/WebSocketService/websocket.service';

import * as fs from 'fs-web';

@Component({
  selector: 'app-frm-login',
  templateUrl: './frm-login.component.html',
  styleUrls: ['./frm-login.component.css']
})
export class FrmLoginComponent implements OnInit, AfterViewInit {

  titulo = environment.titulo;
  version: string = ConfiGlobal.version;
  fechaHoy: string = Utilidades.getFechaHoraActual(true, false, false);

  versionDescargaApk: string;

  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  str_txtUsuario = '';
  str_txtPassword = '';
  str_txtConexion = '';
  str_conexionFichero = '';
  str_txtTipoMime = '';
  str_botonActualizar = '';

  popUpVisibleConexiones: boolean = false;

  //TODO eliminar
  conexiones = [ 'http://192.168.10.158:8081', 'http://192.168.10.222:49221', 'http://192.168.10.48:49220', 'http://192.168.2.74:49221', 'http://192.168.1.49:49221' ];

  WSLogin_Validando: boolean = false;
  WSLogin_Valido: boolean = false;

  WSConexion_Validando: boolean = false;
  WSActualizar_Validando: boolean = false;

  color_txtUsuario: string = '';
  color_txtPassword : string = '';

  vCambiado_txtUsuario: boolean = false;
  vCambiado_txtPassword: boolean = false;

  @ViewChild('txtUsuario', { static: false }) txtUsuario: CmpTextBoxComponent;
  @ViewChild('txtPassword', { static: false }) txtPassword: CmpTextBoxComponent;
  @ViewChild('popUpConexiones', { static: false }) popUpConexiones: DxPopupComponent;

  mensajeError: string;

  validationStatus: string = 'valid';

  verDebug: boolean = false;

  datosLogin;

  checkRecuerdame: boolean = false;

  mostrarBtnActualizar: boolean = false;
  mostrarProgressBar: boolean = false;

  // Maximo valor, el valor que lleva cargado
  maxValue = 0;
  loaded = 0;

  dgConfigTxtUsuario: DataTextBoxConfig = new DataTextBoxConfig(this.str_txtUsuario, this.color_txtUsuario, '', this.vCambiado_txtUsuario, 'text', this.validationStatus);
  dgConfigTxtPassword: DataTextBoxConfig = new DataTextBoxConfig(this.str_txtUsuario, this.color_txtUsuario, '', this.vCambiado_txtUsuario, 'password',  this.validationStatus);
  
  constructor(private cdref: ChangeDetectorRef,
              private router: Router,
              public peticionesGeneralesService: PeticionesGeneralesService,
              public http: HttpClient,
              public translate: TranslateService,
              public resolver: ComponentFactoryResolver) {
  }

  async ngOnInit(): Promise<void> { 
    this.version = this.traducir('frm-login.str_version', 'Versión ') + ConfiGlobal.version;

    this.resetearVariablesGlobales();
  }

  async ngAfterViewInit(): Promise<void> {
    //TODO -revisar para eliminera fichero configuracion
    // try {
    //   // Si en el fichero de Conexion existe una conexión guardada, que pise las variables de ConfiGlobal y se pruebe
    //   await this.comprobarFicheroConexion();
    // } catch { }

    this.txtUsuario.onFocusIn();

    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();

    // Leer archivo "login.json" para mostrar el usuario y la contraseña en caso de que exista
    var login = await Utilidades.leerFicheroLogin(false);
    if((!Utilidades.isEmpty(login.Usuario) || !Utilidades.isEmpty(login.Password)) && login.Recuerdame) {
      this.dgConfigTxtUsuario.stringTxt = login.Usuario;
      this.dgConfigTxtPassword.stringTxt = login.Password;
      this.checkRecuerdame = login.Recuerdame;
    }
  }

  //#region Usuario

  // txtUsuario
  public onValueChanged_txtUsuario() {
    this.vCambiado_txtUsuario = true;
    this.vCambiado_txtPassword = true;
    if (Utilidades.isEmpty(this.dgConfigTxtUsuario.stringTxt) && !Utilidades.isEmpty(this.dgConfigTxtUsuario.color)) {
      this.dgConfigTxtUsuario.color = ConfiGlobal.colorFoco;
    }
  }

  public onEnterKey_txtUsuario() {
    if(Utilidades.isEmpty(this.dgConfigTxtPassword.stringTxt)) {
      this.txtPassword.onFocusIn();
      return;
    }
    this.validarLogin();
  }

  public onFocusIn_txtUsuario() {
    if (Utilidades.isEmpty(this.dgConfigTxtUsuario.stringTxt)) {
      this.dgConfigTxtUsuario.color = ConfiGlobal.colorFoco;
    }
  }

  public onFocusOut_txtUsuario() {
    if (this.dgConfigTxtUsuario.color === ConfiGlobal.colorFoco) {
      this.dgConfigTxtUsuario.color = '';
    }
  }

  //#endregion

  //#region Password

  // txtPassword
  public onValueChanged_txtPassword() {
    this.vCambiado_txtPassword = true;
    if (Utilidades.isEmpty(this.str_txtPassword) && !Utilidades.isEmpty(this.color_txtPassword)) {
      this.color_txtPassword = ConfiGlobal.colorFoco;
    }
  }

  public onEnterKey_txtPassword() {
    if(Utilidades.isEmpty(this.dgConfigTxtUsuario.stringTxt)) {
      this.txtUsuario.onFocusIn();
      return;
    }
    this.validarLogin();
  }

  public onFocusIn_txtPassword() {
    if (Utilidades.isEmpty(this.str_txtPassword)) {
      this.color_txtPassword = ConfiGlobal.colorFoco;
    }
  }

  public onFocusOut_txtPassword() {
    if (this.color_txtPassword === ConfiGlobal.colorFoco) {
      this.color_txtPassword = '';
    }
  }
  
  //#endregion

  async validarLogin() {
    if (!this.dgConfigTxtUsuario.vCambiado) return;
    if (!this.dgConfigTxtPassword.vCambiado) return;
    if (this.WSLogin_Validando) return;
    if (this.WSLogin_Valido) return;
    if (Utilidades.isEmpty(this.dgConfigTxtUsuario.stringTxt)) return;
    if (Utilidades.isEmpty(this.dgConfigTxtPassword.stringTxt)) return;

    // Aparecen los iconos de cargando en los textbox
    this.dgConfigTxtUsuario.validationStatus = 'pending';
    this.dgConfigTxtPassword.validationStatus = 'pending';

    this.mensajeError = '';
    
    if(this.WSConexion_Validando) return;
    
    this.WSConexion_Validando = true;
    //TODO - revisar quitar fichero configuracion
    // Si ya se ha leido el fichero de conexión y contenía datos se salta lo siguiente
    // if(Utilidades.isEmpty(this.str_conexionFichero)) {
    //   try {
    //     // Si en el fichero de Conexion existe una conexión guardada, que pise las variables de ConfiGlobal y se pruebe
    //     await this.comprobarFicheroConexion();
    //   } catch { }
    // }

    var echoPing: any;
    try {
      // Se prueba a hacer echoPing a la Conexion del fichero (si existe) o a la del environment
      echoPing = await this.echoPingConexion();
    } catch (err){
      this.WSConexion_Validando = false;
      this.mensajeError = 'Ha surgido un error. Vuelve a intentarlo más tarde.';
      this.dgConfigTxtUsuario.validationStatus = 'null';
      this.dgConfigTxtPassword.validationStatus = 'null';

      await Utilidades.escribirFicheroLog(err.message, 'frm-login');
      return;
    }

    // Por aquí pasa haya cogido la conexion del fichero o la del environment
    // Si no ha devuelto echoPing, se muestra el error y se debería configurar la conexión
    if(!echoPing) {
      this.mensajeError = 'Revise la configuración de conexión con el servidor';
      this.WSConexion_Validando = false;
      this.dgConfigTxtUsuario.validationStatus = 'null';
      this.dgConfigTxtPassword.validationStatus = 'null';
      return;
    }

    this.translate.currentLoader = new TranslateHttpLoader(
      this.http,
      ConfiGlobal.URL + '/api/idiomas/', ''
    );

    this.WSConexion_Validando = false;

    this.dgConfigTxtUsuario.validationStatus = 'pending';
    this.dgConfigTxtPassword.validationStatus = 'pending';
    this.WSLogin_Validando = true;
    this.peticionesGeneralesService.login(this.dgConfigTxtUsuario.stringTxt, this.dgConfigTxtPassword.stringTxt, ConfiGlobal.version).subscribe(
      async datos => {
        if (Utilidades.DatosWSCorrectos(datos, true)) {
          ConfiGlobal.sessionId = Utilidades.generarId(15); 

          // Se borran los filtros al volver al login
          Utilidades.VarStatic.Filtros = null;
          ConfiGlobal.NombreUsuario = this.dgConfigTxtUsuario.stringTxt;

          this.WSLogin_Valido = true;
  
          this.dgConfigTxtUsuario.validationStatus = 'valid';
          this.dgConfigTxtPassword.validationStatus = 'valid';
  
          //#region  -> CONFIGURACION-PROGRAMA_COMP
          // valores generales
          try { ConfiGlobal.SeparadorGrid = datos.datos.Configuracion.SeparadorGrid; } catch { }          
          try { ConfiGlobal.HttpTimeWait = datos.datos.Configuracion.HttpTimeWait; } catch { }        
          //try { ConfiGlobal.VersionAPK = datos.datos.Configuracion.VersionAPK; } catch { }        

          // WebSocket config
          try { ConfiGlobal.WebSocket_IP = datos.datos.Configuracion.WebSocket_IP; } catch { }
          try { ConfiGlobal.WebSocket_PORT = datos.datos.Configuracion.WebSocket_PORT; } catch { }
          try { ConfiGlobal.WebSocket_Enabled = datos.datos.Configuracion.WebSocket_Enabled; } catch {} 
          if(Utilidades.isEmpty(ConfiGlobal.WebSocket_IP) || ConfiGlobal.WebSocket_PORT === 0){
            ConfiGlobal.WebSocket_Enabled = false;
          }
          // log
          try { ConfiGlobal.SaveLog = datos.datos.Configuracion.SaveLog; } catch { }
          try { ConfiGlobal.RutaLog = datos.datos.Configuracion.RutaLog; } catch { }
          // botones opciones habilitados
          try { ConfiGlobal.EnableTest = datos.datos.Configuracion.EnableTest; } catch {} 
          try { ConfiGlobal.EnableVerLog = datos.datos.Configuracion.EnableVerLog; } catch {} 
          //#endregion

          // PERMISOS
          //try { ConfiGlobal.Permisos = datos.datos.Permisos; } catch {}
          
          // IDIOMAS
          if(!Utilidades.isEmpty(datos.datos.Idiomas)) {
            if (datos.datos.Idiomas.length > 0) {
    
              let array: string[] = [];
              let defecto: string = '';
              datos.datos.Idiomas.forEach(element => {
                array.push(element.ISO);
                if(element.DEFECTO)
                {
                  defecto = element.ISO;
                }
              });
              this.translate.addLangs(array);
              this.translate.setDefaultLang(defecto);
              this.translate.use(defecto);
  
              this.translate.reloadLang(defecto);
              new Utilidades(this.translate, this.resolver, this.http, this.router);
  
  
              // Arrancar el websocket en caso necesario
              if(ConfiGlobal.WebSocket_Enabled)
                Utilidades.set_WS(new WebsocketService());              
                // const browserLang = this.translate.getBrowserLang();
            }
          }

          // Guardado de datos del login en un fichero para poder recuperarlo
          this.datosLogin = {
            'Usuario' : this.dgConfigTxtUsuario.stringTxt,
            'Password' : this.dgConfigTxtPassword.stringTxt,
            'Recuerdame': this.checkRecuerdame
          };
          const login: JSON = this.datosLogin;
          // const fsWeb = require('fs-web');
          fs.writeFile('archivos/login2.json', login);

          this.router.navigate(['/inicio']);

          ConfiGlobal.autorizacion = true;
        }

        this.WSLogin_Validando = false;
        this.dgConfigTxtUsuario.vCambiado = false;
        this.dgConfigTxtPassword.vCambiado = false;
      },
      error => {
        this.WSLogin_Validando = false;
        this.dgConfigTxtUsuario.validationStatus = 'invalid';
        this.dgConfigTxtPassword.validationStatus = 'invalid';
        this.mensajeError = Utilidades.compErrorLogin(error);
        this.limpiarVariables();

        if(environment.apk && error.status === 409) {
          this.str_botonActualizar = 'Actualizar v.' + error.error.NewVersion;
          this.versionDescargaApk = error.error.NewVersion;
          this.mostrarBtnActualizar = true;
        }
      }
    );
  }

  limpiarVariables() {
    this.WSLogin_Validando = false;
    this.WSLogin_Valido = false;
  
    this.color_txtUsuario = '';
    this.color_txtPassword = '';
  }

  //TODO - Eliminar
  /*
  async comprobarFicheroConexion(): Promise<boolean> {    
    // Recupera los datos leídos del fichero de conexión
    const conex = await Utilidades.leerFicheroConexion(false);

    if(Utilidades.isEmpty(conex.IP) || Utilidades.isEmpty(conex.Puerto)) {
      // this.mensajeError = 'Revise la configuración de conexión con el servidor';
      return false;
    } else {
      ConfiGlobal.URL = conex.Conexion;
      ConfiGlobal.dominio = conex.IP;
      ConfiGlobal.puerto = conex.Puerto;

      // Se guarda la conexión leída en memoria
      this.str_conexionFichero = conex.Conexion;

      return true;      
    }    
  }
  */

  async cerrarApp() {
    if(this.dgConfigTxtPassword.stringTxt === 'qwerty') {
      this.verDebug = true;
    } else if(this.dgConfigTxtPassword.stringTxt === 'conexiones') {
      setTimeout(() => {
        this.mensajeError = '';
        this.popUpVisibleConexiones = true;
      }, 200);
    }
  }

  getCerrarPopUpConexion(e) {
    this.popUpVisibleConexiones = e;
  }

  guardarURL() {
    if(!Utilidades.isEmpty(this.str_txtConexion)){
      ConfiGlobal.URL = this.str_txtConexion;
    }
    notify(ConfiGlobal.URL);
  }

  saludar(nombre) {
    this.http.get(nombre).subscribe(
      datos => {
        notify(datos);
      },
      error => {
        notify(error.message);
      }
    );
  }

  async actualizarApk() {
    if(this.WSActualizar_Validando) return;

    this.WSActualizar_Validando = true; 
    this.peticionesGeneralesService.actualizarApk(this.dgConfigTxtUsuario.stringTxt, this.dgConfigTxtPassword.stringTxt).subscribe(
      (response: any) => {
        if(response.type === 0) return; 
        
        // Mientras esta descargando 
        if (response.type === HttpEventType.DownloadProgress) {
          this.mostrarProgressBar = true;
          // Se guarda el maximo valor del tiempo que tardará
          this.maxValue = response.total;
          // Se guarda el momento de carga en el que se encuentra
          this.loaded = response.loaded;
        }
        
        // Cuando ha terminado de descargar 
        if (response.type === HttpEventType.Response) {
          this.WSActualizar_Validando = false;
          this.mostrarProgressBar = false;

          // Se guarda el tipo del archivo que se ha recibido
          const dataType = response.body.type;
          // Se guarda el contenido del archivo
          const binaryData = [];
          binaryData.push(response.body);

          // Se manda a guardar y a abrir para actualizar el apk
          this.GuardarAbrirAPK(new Blob(binaryData, {type: dataType}));
        }
      },
      error => {
        this.WSActualizar_Validando = false;
        this.mostrarProgressBar = false;
        Utilidades.MostrarErrorStr('Error interno en el servidor. Vuelve a intentarlo');
      }
    );
  }

  async GuardarAbrirAPK(blob){
    try{      
      var reader = new FileReader();

      reader.readAsDataURL(blob); 
      reader.onloadend = async () => {
        // Se guarda el contenido del archivo que esta en formato base64
        var base64data = reader.result;   
        
        // Se borra el fichero antes de actualizar
        try {
          await Filesystem.rmdir({
            path: 'Download/vStock',
            directory: Directory.ExternalStorage,
            recursive: true,
          });
        } catch { } 

        // Se escribe el fichero en la carpeta de Descargas
        const result = await Filesystem.writeFile({
          path: 'Download/vStock/VstockMobile_' + this.versionDescargaApk + '.apk',
          data: base64data.toString(),
          directory: Directory.ExternalStorage,
          recursive: true,
        });

        Utilidades.MostrarErrorStr('APK en la carpeta de Descargas. Instalar manualmente', 'success', 4000);
      }
    }
    catch(Error){
      Utilidades.MostrarErrorStr('Error interno. Vuelve a intentarlo')
    }
  }

  async echoPingConexion(): Promise<boolean> {
    var encontrado;

    try {
      encontrado = await this.http.get(ConfiGlobal.URL + '/api/login/echoping').pipe(timeout(8000)).toPromise();
    } catch (Error) {
      console.log(Error);
      encontrado = false;
      
      await Utilidades.escribirFicheroLog(Error.message, 'frm-login');
    }
    
    return encontrado;
  }

  verVersion() {
    alert(ConfiGlobal.version);
  }

  format(ratio) {
    return 'Descargando: ' + Math.round(ratio * 100) + '%';
  }

  resetearVariablesGlobales() {
    ConfiGlobal.sessionId = null;
  }

  LPGen(value : boolean) {
    Utilidades.VerLPGenerico(value);
    return value;
  }

  traducir(key: string, def: string): string {
    let traduccion: string = this.translate.instant(key);
    if (traduccion !== key) {
      return traduccion;
    } else {
      return def;
    }
  }

  onResize(event) { 
  }
}

