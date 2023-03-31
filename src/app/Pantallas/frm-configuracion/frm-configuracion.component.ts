import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';

import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../Utilidades/Utilidades';
import { Configuracion, Almacen } from '../../Clases/Maestros';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';

import { DxFormComponent } from 'devextreme-angular';



@Component({
  selector: 'app-frm-configuracion',
  templateUrl: './frm-configuracion.component.html',
  styleUrls: ['./frm-configuracion.component.css']
})
export class FrmConfiguracionComponent implements OnInit {
  
//#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('formConfig', { static: false }) formConfig: DxFormComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-configuracion.btnSalir', 'Cancelar'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-configuracion.btnGuaradr', 'Guardar'), posicion: 2, accion: () => {this.guardarDatos()}, tipo: TipoBoton.success },
  ];

  WSDatos_Validando: boolean = false;

  _config: Configuracion = new(Configuracion);
  modoEdicion: boolean = true;

  arrayEstadosEntrada: Array<{id:number, nombre:string}> = [];
  arrayEstadosSalida: Array<{id:number, nombre:string}> = [];
  arrayAlmacenDefecto: Array<{id:number, nombre:string}> = [];

//#endregion - declaracion de cte y variables 

//#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { 
    // copia de var ConfiGlobal
    this._config = Object.assign({},ConfiGlobal.configLayher);
    
    // Gestión de almacenes por defecto
    this.arrayAlmacenDefecto.push({id:0, nombre:this.traducir('frm-configuracion.nombreAlmaNoAsignar','No Asignar')});
    this.arrayAlmacenDefecto.push({id:1, nombre:this.traducir('frm-configuracion.nombreAlmaUsuario','Asignado al usuario')});
    this.arrayAlmacenDefecto.push({id:2, nombre:this.traducir('frm-configuracion.nombreAlmaPrefijo','Prefijo del Contrato')});    
    
    // estados entradas por defecto
    //this.arrayEstadosEntrada = Object.assign({},ConfiGlobal.arrayEstadosEntrada);
    this.arrayEstadosEntrada.splice(0, 0,{id:0, nombre:'No asignar'});
    this.arrayEstadosEntrada.push({id:1, nombre:'PENDIENTE'});
    this.arrayEstadosEntrada.push({id:2, nombre:'CONFIRMADO'});
    
    // estados salidas por defecto
    //this.arrayEstadosSalida = Object.assign({},ConfiGlobal.arrayEstadosSalida);
    this.arrayEstadosSalida.splice(0, 0,{id:0, nombre:'No asignar'});
    this.arrayEstadosSalida.push({id:1, nombre:'PENDIENTE'});
    this.arrayEstadosSalida.push({id:2, nombre:'CONFIRMADO'});
  }

  ngOnInit(): void {
    //this.cargarSalidas(-1);
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
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

//#endregion

//#region - web_services

  async guardarConfiguracion(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.setConfigPlanificador(this._config.NumItemPlanificador,this._config.EntradaConfirmarDefecto,this._config.EntradaEstadoDefecto,this._config.EntradaAlmacenDefecto,
                                                          this._config.SalidaPlanificarDefecto,this._config.SalidaEstadoDefecto,this._config.SalidaAlmacenDefecto)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-configuracion.msgOk_WSActualizarConfiguracion','Configuracion actualizado'));           
          //Actualizamos var ConfigGlobal
          ConfiGlobal.configLayher = this._config;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-configuracion.msgError_WSActualizarConfiguracion','Error actualizando configuración')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-configuracion');
      }
    );
  }   

//#endregion

  validarDatosFormulario():boolean{
    const res = this.formConfig.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }  

  guardarDatos(){
    if (!this.validarDatosFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-configuracion.msgError_FaltanDatos','Faltan campos obligatorios. Revise el formulario'));
      return;
    }
    else {
      // llamar a web_service de importacion
      this.guardarConfiguracion();
    }        
  }  

  salir() {
    this.location.back();
  }  

}
