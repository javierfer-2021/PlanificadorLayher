import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlantillaStock, PlantillaStockLinea } from '../../../Clases/PlantillaStock';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxTextBoxComponent, DxPopupComponent } from 'devextreme-angular';
import { locale } from 'devextreme/localization';
import { UtilidadesLayher } from '../../../Utilidades/UtilidadesLayher'

@Component({
  selector: 'app-frm-plantilla-stock-calcular',
  templateUrl: './frm-plantilla-stock-calcular.component.html',
  styleUrls: ['./frm-plantilla-stock-calcular.component.css']
})
export class FrmPlantillaStockCalcularComponent implements OnInit {


  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  loadingVisible = false;
  indicatorUrl = "";
  loadingMessage = 'Cargando...'    
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  @ViewChild('formPlantillaStock', { static: false }) formPlantillaStock: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-plantilla-stock-calcular.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
  ];
  
  
  WSDatos_Validando: boolean = false; 
  aviso :boolean = false;
  
  _plantillaStock: PlantillaStock = new(PlantillaStock);
  
  // grid lista articulos asociados a la plantilla -- calculo stock disponible
  arrayLineasSalida: Array<PlantillaStockLinea> = [];
  cols: Array<ColumnDataGrid> = [    
    {
      dataField: 'IdPlantilla',
      caption: this.traducir('frm-plantilla-stock-calcular.colIdPlantilla','IdPlantilla'),
      visible: false,
    },  
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-plantilla-stock-calcular.colIdArticulo','Articulo'),
      visible: true,
      width: 200,
    },            
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-plantilla-stock-calcular.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'StockInicial',
      caption: this.traducir('frm-plantilla-stock-calcular.colAvisos','Stock Inicial'),
      visible: true, 
      width: 150,
    },                  
    {
      dataField: 'UndDisponibles',
      caption: this.traducir('frm-plantilla-stock-calcular.colAvisos','Stock Disp.'),
      visible: true, 
      width: 150,
    },
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(this.arrayLineasSalida, this.cols, 400, '' );

  //popUp Ayuda Pantalla
  @ViewChild('popUpAyuda', { static: false }) popUpAyuda: DxPopupComponent;
  popUpVisibleAyuda:boolean = false;

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
    // Asignar localizacion ESPAÑA
    locale('es');
    // obtenemos dato identificacion de envio del routing
    const nav = this.router.getCurrentNavigation().extras.state;      
    if (( nav.Plantilla !== undefined) && ( nav.Plantilla !== null)) {
      this._plantillaStock = nav.Plantilla;
      this._plantillaStock.FechaCalculo = new Date();
    } else {
      Utilidades.MostrarErrorStr('Parametro Plantilla No identificado');
      this.btnSalir();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {       
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // configuracion extra del grid -> mostrar fila total registros + redimensionar
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo','Total Líneas: ','count');
    this.dg.habilitarExportar('plantilla_stock.xlsx');    
    this.dg.panelBusqueda(true);    
    this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
    // obtener valores calculo inicial
    this.calcularValoresPlantillaStock();  
    // foco
    setTimeout(() => { this.setFormFocus('FechaCalculo'); }, 200);    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();     
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
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

  async calcularValoresPlantillaStock(){
    if (this.WSDatos_Validando) return; 

    this.WSDatos_Validando = true;
    (await this.planificadorService.calcularValoresPlantillaStock(this._plantillaStock)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayLineasSalida = datos.datos;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);
        } else { 
            Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock-calcular.msgError_WSCalcularPlantillaStock','Error WS calcular stock plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock-calcular');
      }
    );
  }
  
  //#endregion
   
  btnSalir() {
    this.location.back();
  }
 

  setFormFocus(campo:string){
    try {
      const editor = this.formPlantillaStock.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  onFechaInicioValueChanged(e){
    // Correcion año 2 a 4 digitos
    if (!Utilidades.isEmpty(this._plantillaStock.FechaCalculo)) {
      if ((this._plantillaStock.FechaCalculo.getFullYear()<1900)) {
        this._plantillaStock.FechaCalculo = Utilidades.year2to4digits(this._plantillaStock.FechaCalculo);
      }      
      // recalcular stock plantilla a nueva fecha
      // alert(this._plantillaStock.FechaCalculo);
      this.calcularValoresPlantillaStock();
    } else {
      this.arrayLineasSalida = [];
    }
  }

  //----------------------------------------
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

