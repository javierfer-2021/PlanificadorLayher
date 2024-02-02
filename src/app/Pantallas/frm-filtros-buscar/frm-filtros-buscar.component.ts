import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, Input } from '@angular/core';
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
import { DxCheckBoxComponent, DxSelectBoxComponent, DxRadioGroupComponent, DxPopupComponent, DxNumberBoxComponent } from 'devextreme-angular';
import { filtrosBusqueda}  from '../../Clases/Salida';

@Component({
  selector: 'app-frm-filtros-buscar',
  templateUrl: './frm-filtros-buscar.component.html',
  styleUrls: ['./frm-filtros-buscar.component.css']
})
export class FrmFiltrosBuscarComponent implements OnInit {

  @Input() fsalida : boolean; // parametro que le indica si el filtro es aplicable a Salidas (true) o Entradas (false)
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
  @ViewChild('checkSinConfirmar', { static: false }) checkSinConfirmar: DxCheckBoxComponent; 
  @ViewChild('radioGroupContiene', { static: false }) radioGroupContiene: DxRadioGroupComponent; 

  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-filtros-buscar.btnAceptar', 'Aceptar'), posicion: 2, accion: () => {this.btnAceptar()}, tipo: TipoBoton.success},
  ];

  WSDatos_Validando: boolean = false;
  loadIndicatorVisible: boolean = true;
  
  IdArticulo: string = '';
  str_txtArticulo:string = '';
  str_txtFamilia:string = '';
  str_txtSubfamilia:string = '';
  mostrarCanceladas:boolean = false;
  buscarSinConfirmar = false;
  diasSinConfirmar:number = ConfiGlobal.configLayher.DiasPermitidosSinConfirmar;

  arrayFamilias: Array<ArticuloFamilia> = [];
  arraySubfamilias: Array<ArticuloSubfamilia> = [];

  filtros:filtrosBusqueda = new filtrosBusqueda();

  arrayTipoFiltroContiene: Array<valorFiltroContiene> = [];
  
  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;
  popUpTitulo:string = "Selección Articulo";

  //config botones textBox buscar articulo
  configBtnLimpiarArticulo:any;
  configBtnBuscarArticulo:any;

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
    
    this.arrayTipoFiltroContiene.push({valor:true, texto:'Contiene'},{valor:false, texto:'NO Contiene'})
    // inicializacion var filtros   
    this.filtros = new filtrosBusqueda();   
    this.filtros.mostrarCanceladas=this.mostrarCanceladas; 
    this.filtros.buscarSinConfirmar=this.buscarSinConfirmar; 
    this.filtros.diasSinConfirmar=this.diasSinConfirmar;
    this.filtros.valorContiene=true;
    this.filtros.IdFamilia=0;
    this.filtros.IdSubfamilia=0;   
    
    //Config botones text-box (limpiar, buscar articulo)
    this.configBtnLimpiarArticulo = {
      icon: 'clear',
      stylingMode: 'text',
      text: '',
      disabled: false,
      type: 'default',      
      onClick: () => { this.btnLimpiarArticulo() }
    };

    this.configBtnBuscarArticulo = {
      icon: 'find',
      stylingMode: 'text',
      text: '',
      disabled: false,
      type: 'default',
      onClick: () => { this.btnBuscarArticulo() }
    };

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
    this.filtros.valorContiene = this.radioGroupContiene.value;
    this.filtros.IdArticulo = this.IdArticulo;
    this.filtros.IdFamilia = (Utilidades.isEmpty(this.comboFamilia.value)) ? 0 : this.comboFamilia.value;
    this.filtros.IdSubfamilia = (Utilidades.isEmpty(this.comboSubfamilia.value)) ? 0 : this.comboSubfamilia.value;
    this.filtros.mostrarCanceladas = this.checkCanceladas.value;
    if (this.fsalida) {
      this.filtros.buscarSinConfirmar = this.checkSinConfirmar.value;
      this.filtros.diasSinConfirmar = this.diasSinConfirmar;
    }
    this.cerrarPopUp.emit(this.filtros);
  }

  limpiarFiltros(){
    this.mostrarCanceladas=false; 
    this.buscarSinConfirmar=false; 
    this.diasSinConfirmar=ConfiGlobal.configLayher.DiasPermitidosSinConfirmar;
    this.checkCanceladas.value=true;
    this.filtros.valorContiene=true;
    this.comboFamilia.value = 0;
    this.comboSubfamilia.value = 0;
    this.btnLimpiarArticulo();
  }

  btnLimpiarArticulo(){
    this.IdArticulo = '';
    this.str_txtArticulo = '';
  }

  btnBuscarArticulo(){
    this.popUpVisibleArticulos = true;
  }

  cerrarSeleccionarArticulo(e){
    if (e != null) {
      this.IdArticulo = e.IdArticulo;
      this.str_txtArticulo = e.NombreArticulo;
    }
    this.popUpVisibleArticulos = false;
  }

}

export class valorFiltroContiene {
  valor:boolean;
  texto:string;
}