import { Component, OnInit, ViewChild, ElementRef, EventEmitter, AfterViewInit, Renderer2, Output, ValueProvider } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DxRadioGroupComponent, DxTextBoxComponent } from 'devextreme-angular';
import { timeout } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

import * as fs from 'fs-web';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';

@Component({
  selector: 'app-frm-conexiones',
  templateUrl: './frm-conexiones.component.html',
  styleUrls: ['./frm-conexiones.component.css']
})
export class FrmConexionesComponent implements OnInit, AfterViewInit {
  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @Output() cerrarPopUpConexion = new EventEmitter<boolean>();

  // fsWeb = require('fs-web');
  datosConexion;

  btnAcciones: BotonPantalla[] = [
    // { icono: '', texto: 'Cerrar', posicion: 1, accion: () => {}, tipo: Enumeraciones.TipoBoton.danger },
    { icono: '', texto: 'Guardar', posicion: 1, accion: () => {}, tipo: TipoBoton.success, activo: true, visible: true },
    { icono: '', texto: 'Limpiar', posicion: 2, accion: () => {}, tipo: TipoBoton.secondary, activo: true, visible: true },
  ];

  str_txtIP = '';
  str_txtIPMemoria = '';
  str_txtPuerto = '';
  str_txtPuertoMemoria = '';
  str_tipoConexionMemoria = '';
  str_txtConexion;

  WSEchoPing_Validando: boolean = false;

  popUpConexionesVisible: boolean = false;

  color_txtNombre: string = '';
  color_txtIP: string = '';
  color_txtPuerto: string = '';

  tiposConexion = ['http', 'https'];
  tipoConexion;

  @ViewChild('txtIP', { static: false }) txtIP: DxTextBoxComponent;
  @ViewChild('txtPuerto', { static: false }) txtPuerto: DxTextBoxComponent;
  @ViewChild("radioTiposConexion") radioTiposConexion: DxRadioGroupComponent;

  constructor(private renderer: Renderer2, public translate: TranslateService, public http: HttpClient) {
    // se añaden las acciones a lo botones
    this.btnAcciones.forEach((a, b, c) => {
      /* if (a.posicion === 1) {
        a.accion = () => {
          // Se cierra el popup
          Utilidades.VarStatic.AbrirPopUpConexion = false;
        };
      } */
      if (a.posicion === 1) {
        a.accion = () => {
          this.guardar();

        };
      }
      if (a.posicion === 2) {
        a.accion = () => {
          this.limpiarControles();
        };
      }
    });
  }

  ngOnInit(): void { }
  
  // para actualizar la altura de btnFooter
  async ngAfterViewInit(): Promise<void> {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcciones, this.renderer);

    this.limpiarControles();

    await this.leerArchivoConexion(false);
    
    if(!Utilidades.isEmpty(this.str_txtIPMemoria) || !Utilidades.isEmpty(this.str_txtPuertoMemoria) || !Utilidades.isEmpty(this.str_tipoConexionMemoria)) {
      this.str_txtIP = this.str_txtIPMemoria;
      this.str_txtPuerto = this.str_txtPuertoMemoria;
      this.tipoConexion = this.str_tipoConexionMemoria;
      this.txtIP.instance.focus();
    } else {
      this.str_txtIP = '';
      this.str_txtPuerto = '';
      this.tipoConexion = this.tiposConexion[0]; 
    }

    if(Utilidades.isEmpty(this.str_txtIP) || Utilidades.isEmpty(this.str_txtPuerto)) {
      this.txtIP.instance.focus();
    } 
  }

  ngAfterContentChecked(): void {   
    this.btnAcciones.forEach((a, b, c) => {
      /* if (a.posicion === 1) {
        a.texto = this.traducir('frm-conexiones.btnCerrar', 'Cerrar');
      } */
      if (a.posicion === 1) {
        a.texto = this.traducir('frm-conexiones.btnGuardar', 'Guardar');
      }
      if (a.posicion === 2) {
        a.texto = this.traducir('frm-conexiones.btnLimpiar', 'Limpiar');
      }
    });
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(
      this.pantalla,
      this.container,
      this.btnFooter,
      this.btnAcciones,
      this.renderer
    );
  }

  //#region txtIP
    public onEnterKey_txtIP() {
      this.onFocusOut_txtIP();
    }

    public onFocusIn_txtIP() {
      if (Utilidades.isEmpty(this.str_txtIP)) {
        this.color_txtIP = ConfiGlobal.colorFoco;
      }
    }

    public onFocusOut_txtIP() {
      if (this.color_txtIP === ConfiGlobal.colorFoco) {
        this.color_txtIP = '';
      }
      if(Utilidades.isEmpty(this.str_txtPuerto) && !Utilidades.isEmpty(this.str_txtIP))
        this.txtPuerto.instance.focus();
      else if(Utilidades.isEmpty(this.str_txtIP))
        this.txtIP.instance.focus();
    }
  //#endregion

  //#region txtPuerto
  public onEnterKey_txtPuerto() {
    this.onFocusOut_txtPuerto();
  }

  public onFocusIn_txtPuerto() {
    if (Utilidades.isEmpty(this.str_txtPuerto)) {
      this.color_txtPuerto = ConfiGlobal.colorFoco;
    }
  }

  public onFocusOut_txtPuerto() {
    if (this.color_txtPuerto === ConfiGlobal.colorFoco) {
      this.color_txtPuerto = '';
    }
    if(Utilidades.isEmpty(this.str_txtPuerto))
      this.txtPuerto.instance.focus();
  }
//#endregion

  async actualizarArchivo() {
    // const fsWeb = require('fs-web');

    this.datosConexion = {
      'IP' : this.str_txtIP,
      'Puerto' : this.str_txtPuerto,
      'TipoConexion': this.tipoConexion
    };
    const conexion: JSON = this.datosConexion;

    fs.writeFile('archivos/conexion.json', conexion);
    // Utilidades.MostrarExitoStr('Fichero de conexión actualizado', 'success', 1500);

    await this.leerArchivoConexion(false);
  }

  async leerArchivoConexion(mostrarDatos: boolean = true): Promise<boolean> {
    var conex;
    try {
      conex = await Utilidades.leerFicheroConexion(mostrarDatos);
      this.str_txtConexion = conex.Conexion;
      this.str_txtIPMemoria = conex.IP;
      this.str_txtPuertoMemoria = conex.Puerto;
      this.str_tipoConexionMemoria = conex.TipoConexion;
      return true;
      // await Utilidades.delay(3000);
    } catch (err){
      await Utilidades.escribirFicheroLog(err.message, 'frm-conexiones');
      return false;
    }
  }
  
  async guardar() {
    if(Utilidades.isEmpty(this.str_txtIP)) {
      Utilidades.MostrarErrorStr('Introduce una IP');
      this.txtIP.instance.focus();
      return;
    } else if(Utilidades.isEmpty(this.str_txtPuerto)) {
      Utilidades.MostrarErrorStr('Introduce un Puerto');
      this.txtPuerto.instance.focus();
      return;
    }

    var conexion = this.tipoConexion + '://' + this.str_txtIP + ':' + this.str_txtPuerto;
    var result = <boolean>await Utilidades.ShowDialogString(
      this.traducir('frm-conexiones.Msg_Guardar','La Conexión es ' + conexion + '\n¿Desea guardarla?'), 
      this.traducir('frm-conexiones.titleGuardar','Guardar Conexión'));
    if(result) {
      ConfiGlobal.URL = conexion;
      ConfiGlobal.dominio = this.str_txtIP;
      ConfiGlobal.puerto = this.str_txtPuerto;

      Utilidades.MostrarExitoStr('Se ha guardado la conexión');

      this.actualizarArchivo();

      this.limpiarControles();
      this.cerrarPopUpConexion.emit(false);
    } 
  }

  async echoPing() {
    if(Utilidades.isEmpty(this.str_txtIP) || Utilidades.isEmpty(this.str_txtPuerto)) return;
    
    var encontrado;
    var conexion = this.tipoConexion + '://' + this.str_txtIP + ':' + this.str_txtPuerto;

    this.WSEchoPing_Validando = true;
    try {
      encontrado = await this.http.get(conexion + '/api/login/echoping').pipe(timeout(8000)).toPromise();
    } catch (Error) {
      console.log(Error);
      encontrado = false;
      
      await Utilidades.escribirFicheroLog(Error.message, 'frm-conexiones');
    }
    this.WSEchoPing_Validando = false;
    
    if(encontrado) {
      Utilidades.MostrarErrorStr('La conexión introducida es correcta', 'success', 3000);
    } else {
      Utilidades.MostrarErrorStr('La conexión introducida es incorrecta', 'error', 3000);
    }
  }

  limpiarControles() {
    this.str_txtIP = null;
    this.str_txtPuerto = null;
    this.str_txtConexion = null;
    this.tipoConexion = this.tiposConexion[0];
    this.txtIP.instance.focus();
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
}

