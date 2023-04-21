import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ArticuloFamilia,ArticuloSubfamilia } from '../../Clases/Maestros';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { DxCheckBoxComponent, DxSelectBoxComponent } from 'devextreme-angular';
import { filtrosBusqueda}  from '../../Clases/Salida';

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
  @ViewChild('checkCanceladas', { static: false }) checkCanceladas: DxCheckBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnAceptar', 'Aceptar'), posicion: 2, accion: () => {this.btnAceptar()}, tipo: TipoBoton.success},
  ];

  WSDatos_Validando: boolean = false;
  loadIndicatorVisible: boolean = true;

  str_txtFamilia:string = '';
  str_txtSubfamilia:string = '';
  mostrarCanceladas:boolean = false;

  arrayFamilias: Array<ArticuloFamilia> = [];
  arraySubfamilias: Array<ArticuloSubfamilia> = [];

  filtros:filtrosBusqueda = new filtrosBusqueda();

  //#endregion

  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { 
    // Asignar localizacion ESPAÑA
    locale('es');
    // inicializacion var filtros
    this.filtros = new filtrosBusqueda();
    this.filtros.IdFamilia=0;
    this.filtros.IdSubfamilia=0; 
    this.filtros.mostrarCanceladas=false;      
  }

  ngOnInit(): void {
    this.cargarCombosFiltro();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco
    this.comboFamilia.instance.focus();
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
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaFamiliasSubfamilias(0)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayFamilias = datos.datos.Familias;
          this.arraySubfamilias = datos.datos.Subfamilias;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-filtros-buscar.msgError_WSCargarCombos','Error cargando familias y subfamilias')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-filtros-buscar');
      }
    );
  }

  //#endregion 

  
  //#region -- botones de opciones principales

  btnCancelar() {
    this.cerrarPopUp.emit(null)
  }

  btnAceptar(){
    // comprobar subfamilia asignada a la familia

    // devolucion filtros seleccionados
    this.filtros.IdFamilia = (Utilidades.isEmpty(this.comboFamilia.value)) ? 0 : this.comboFamilia.value;
    this.filtros.IdSubfamilia = (Utilidades.isEmpty(this.comboSubfamilia.value)) ? 0 : this.comboSubfamilia.value;
    this.filtros.mostrarCanceladas = this.checkCanceladas.value;
    this.cerrarPopUp.emit(this.filtros);
  }


}
