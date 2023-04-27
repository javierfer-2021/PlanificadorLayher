import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { BotonIcono } from '../../../Clases/Componentes/BotonIcono';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent,DxTextBoxComponent, DxPopupComponent, DxTextAreaModule, DxSelectBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Incidencia, TipoIncidencia } from '../../../Clases/Incidencia';
import { Almacen } from '../../../Clases/Maestros';

@Component({
  selector: 'app-frm-incidencia',
  templateUrl: './frm-incidencia.component.html',
  styleUrls: ['./frm-incidencia.component.css']
})
export class FrmIncidenciaComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formIncidencia', { static: false }) formIncidencia: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-incidencia.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia.btnCancelar', 'Cancelar'), posicion: 2, accion: () => {this.btnCancelarOferta()}, tipo: TipoBoton.secondary },
  ];
    
  btnIconoInsertar: BotonIcono =  { icono: 'bi bi-search', texto: this.traducir('frm-incidencia.btnCrear', 'Crear'), accion: () => this.btnCrearIncidencia(), nroFilas:1 };
  btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-incidencia.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarIncidencia(), nroFilas:1 };

  editandoIncidencia: boolean = false;
  WSDatos_Validando: boolean = false;

  _incidencia: Incidencia;
  arrayTiposIncidencia: Array<TipoIncidencia> = [];
  arrayAlmacenes: Array<Almacen> = [];

  str_txtTipoIncidencia: string;
  
  //#endregion


  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              )  
    { 
      // obtenemos dato identificacion de envio del routing
      // const nav = this.router.getCurrentNavigation().extras.state;      
      // if (( nav.oferta !== null) && ( nav.oferta !== undefined)) {
      //   this._oferta= nav.oferta;
      // }
    }


  ngOnInit(): void {
    // this.cargarCombos();
    // setTimeout(() => {this.cargarLineasOferta();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco 

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

  //#region -- WEB_SERVICES

  async cargarCombos(){
    if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.getCombos_PantallaSalidas()).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.arrayTiposEstadoOferta = datos.datos.ListaEstados;
    //       this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     console.log(error);
    //   }
    // );
  }  

  //#endregion
  
  btnCrearIncidencia() {   
  }

  btnLimpiarIncidencia(){    
  }  

  btnSalir() {
    this.location.back();
  }

  btnCancelarOferta(){
    alert('Función no implementada')
  }
}



