import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';

import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../Clases/Componentes/DataSelectBoxConfig';

import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { BotonMenu } from '../../Clases/Componentes/BotonMenu';
import { Utilidades } from '../../Utilidades/Utilidades';
import { Configuracion, Almacen } from '../../Clases/Maestros';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';

@Component({
  selector: 'app-frm-importar-maestros',
  templateUrl: './frm-importar-maestros.component.html',
  styleUrls: ['./frm-importar-maestros.component.css']
})
export class FrmImportarMaestrosComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('sbAlmacenes', { static: false }) sbAlmacenes: CmdSelectBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-configuracion.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];

  botonStock: BotonMenu = { icono: './assets/icons/stock.svg', texto: 'Importar Articulos', ruta: '', nombre: 'botonStock', notificacion: 0, desactivado: false,
                            accion: () => {this.importarArticulos() } };
  botonIniciarPeriodo: BotonMenu = { icono: './assets/icons/servidor-web.svg', texto: 'Iniciar Periodo (Stock)', ruta: '', nombre: 'botonIniciarPeriodo', notificacion: 0, desactivado: false, 
                                     accion: () => {this.iniciarPeriodo() } };

  WSDatos_Validando: boolean = false;

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
  //#endregion - declaracion de cte y variables 


  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { }

  ngOnInit(): void {
    //this.cargarSalidas(-1);    
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.sbAlmacenes.SelectBox.value=this.almacenes[0].IdAlmacen;
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
    // if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.setConfigPlanificador(this._config.NumItemPlanificador,this._config.EntradaConfirmarDefecto,this._config.EntradaEstadoDefecto,this._config.EntradaAlmacenDefecto,
    //                                                       this._config.SalidaPlanificarDefecto,this._config.SalidaEstadoDefecto,this._config.SalidaAlmacenDefecto)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       Utilidades.MostrarExitoStr(this.traducir('frm-configuracion.msgOk_WSActualizarConfiguracion','Configuracion actualizado'));           
    //       //Actualizamos var ConfigGlobal
    //       ConfiGlobal.configLayher = this._config;          
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-configuracion.msgError_WSActualizarConfiguracion','Error actualizando configuración')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     console.log(error);
    //   }
    // );
  }   

  //#endregion

  importarArticulos() {
    alert('sincronizar articulos y familias');
  }

  iniciarPeriodo() {
    alert('Inizializar periodo -Traer stock y recalcular planificador');
  }

  salir() {
    this.location.back();
  }  

}
