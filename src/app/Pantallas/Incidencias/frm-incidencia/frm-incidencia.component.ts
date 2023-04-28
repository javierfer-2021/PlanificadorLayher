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
    { icono: '', texto: this.traducir('frm-incidencia.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardarIncidencia()}, tipo: TipoBoton.success },
  ];
    
  // btnIconoInsertar: BotonIcono =  { icono: 'bi bi-search', texto: this.traducir('frm-incidencia.btnCrear', 'Crear'), accion: () => this.btnCrearIncidencia(), nroFilas:1 };
  // btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-incidencia.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarIncidencia(), nroFilas:1 };

  editandoIncidencia: boolean = false;
  WSDatos_Validando: boolean = false;

  _incidencia: Incidencia;
  arrayTiposIncidencia: Array<TipoIncidencia> = [];
  arrayAlmacenes: Array<Almacen> = [];

  //str_txtTipoIncidencia: string;
  

  contratoOptions: any = {
    disabled: false,
    buttons: [
      {
        name: 'buscarContrato',
        location: 'after',
        options: {
          icon: 'find',
          type: 'default',
          onClick: () => this.buscarContrato(),
        },
      },
    ],
  };

  articuloOptions: any = {
    disabled: false,
    buttons: [
      {
        name: 'buscarArticulo',
        location: 'after',
        options: {
          icon: 'find',
          type: 'default',
          onClick: () => this.buscarArticulo(),
        },
      },
    ],
  };

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
      const nav = this.router.getCurrentNavigation().extras.state;      
      if (( nav.incidencia !== null) && ( nav.incidencia !== undefined)) {
        this._incidencia = nav.incidencia;
        this.editandoIncidencia = false;
        // personalizar botones formulario
        BotonPantalla[0].texto=this.traducir('frm-incidencia.btnSalir', 'Salir');
        BotonPantalla[1].visible=false;
      } else {
        this._incidencia = new(Incidencia);
        this.editandoIncidencia = true;
        this._incidencia.FechaAlta = new Date();
      }
    }


  ngOnInit(): void {
    this.cargarCombos();
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

    this.WSDatos_Validando = true;
    let filtroAlmacen:number= 0; // todos los almacenes activos
    (await this.planificadorService.getCombos_PantallaIncidencias(filtroAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposIncidencia = datos.datos.ListaTipos;
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencias.msgError_WSCargarCombos','Error cargando valores Tipos Incidencia/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  //#endregion
  
  btnCrearIncidencia() {   
  }

  btnLimpiarIncidencia(){    
  }  

  btnSalir() {
    this.location.back();
  }

  btnGuardarIncidencia(){
    alert('Función no implementada')
  }
  
  buscarContrato(){
    Utilidades.ShowDialogAviso('Buscar Contrato -> Funcion no implementada')
  }

  buscarArticulo(){
    Utilidades.ShowDialogAviso('Buscar Artículo -> Funcion no implementada')
  }

}

