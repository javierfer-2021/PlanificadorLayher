import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../Clases/Componentes/DataSelectBoxConfig';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ArticuloFamilia,ArticuloSubfamilia } from '../../Clases/Maestros';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { DxSelectBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-filtros-buscar',
  templateUrl: './frm-filtros-buscar.component.html',
  styleUrls: ['./frm-filtros-buscar.component.css']
})
export class FrmFiltrosBuscarComponent implements OnInit {

  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('comboFamilia', { static: false }) comboFamilia: DxSelectBoxComponent
  @ViewChild('comboSubfamilia', { static: false }) comboSubfamilia: DxSelectBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnAceptar', 'Aceptar'), posicion: 2, accion: () => {this.btnAceptar()}, tipo: TipoBoton.success},
  ];

  WSDatos_Validando: boolean = false;
  loadIndicatorVisible: boolean = true;

  str_txtFamilia:string = '';
  str_txtSubfamilia:string = '';

  arrayFamilias: Array<ArticuloFamilia> = [];
  arraySubFamilias: Array<ArticuloSubfamilia> = [];

  //#endregion

  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { 
    // Asignar localizacion ESPAÑA
    locale('es');
  }

  ngOnInit(): void {
    this.cargarCombosFiltro();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco
    //this.dg.DataGrid.instance.focus();    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
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


  //#region -- web_services
  
  async cargarCombosFiltro(){
    if (this.WSDatos_Validando) return;
    
    // this.WSDatos_Validando = true;
    // (await this.planificadorService.getStockArticulos(almacen)).subscribe(
    //   (datos) => {
    //     if (Utilidades.DatosWSCorrectos(datos)) {
    //       this.loadIndicatorVisible = true;
    //       // asignar valores devuletos
    //       this.arrayStockArticulos = datos.datos;
    //       this.dgConfig = new DataGridConfig(this.arrayStockArticulos, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       if (this.arrayStockArticulos.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
    //       else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
    //       this.loadIndicatorVisible = false;
    //     }
    //     else {
    //       Utilidades.MostrarErrorStr(this.traducir('frm-filtros-buscar.msgErrorWS_CargarArticulosStock','Error web-service obtener lista filtros-buscar')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, (error) => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-filtros-buscar');
    //   }
    // );
  }

  //#endregion 

  
  //#region -- botones de opciones principales

  btnCancelar() {
    this.cerrarPopUp.emit(null)
  }

  btnAceptar(){
    this.cerrarPopUp.emit({familia:1,subfamilia:0})
  }


}
