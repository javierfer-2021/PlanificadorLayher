import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';

import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../Utilidades/Utilidades';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';

import { DxPopupComponent } from 'devextreme-angular';



@Component({
  selector: 'app-frm-utils-admin-bd',
  templateUrl: './frm-utils-admin-bd.component.html',
  styleUrls: ['./frm-utils-admin-bd.component.css']
})
export class FrmUtilsAdminBdComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  loadingVisible = false;
  indicatorUrl = "";
  loadingMessage = 'Cargando...'  
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;


  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('sbAlmacenes', { static: false }) sbAlmacenes: CmdSelectBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-utils-admin-bd.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];
  
  WSDatos_Validando: boolean = false;
 
  //popUp Ayuda Pantalla
  @ViewChild('popUpAyuda', { static: false }) popUpAyuda: DxPopupComponent;
  popUpVisibleAyuda:boolean = false;  

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

  // --
  //#region - web_services

  //#endregion


  // --
  //#region - botones y funcionalidades principales

  salir() {
    this.location.back();
  }  

  //#endregion


  // --
  //#region -- gestion loadPanel

  async mostrarPanelProceso (mensaje?:string) {
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      this.loadingMessage = mensaje;
    }
    this.loadingVisible = true;
  }

  async ocultarPanelProceso () {
    this.indicatorUrl = "";
    this.loadingVisible = false;
  }

  async ocultarPanelProceso_Exito (mensaje?:string) {
    this.indicatorUrl = "../../assets/gifs/checkBackground.gif";
    await Utilidades.delay(1000);
    this.loadingVisible = false;
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarExitoStr(mensaje,'success',3000);
    }
  }

  async ocultarPanelProceso_Fallo (mensaje?:string) {
    this.indicatorUrl = "";
    this.loadingVisible = false;
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarErrorStr(mensaje);
    }    
  }  

  //#endregion

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }    

}
