import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../../Clases/Componentes/DataSelectBoxConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { ArticuloStock } from '../../../Clases/Articulo';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { Almacen } from 'src/app/Clases/Maestros';
import { DxNumberBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-articulos-buscar',
  templateUrl: './frm-articulos-buscar.component.html',
  styleUrls: ['./frm-articulos-buscar.component.css']
})
export class FrmArticulosBuscarComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  
  @Input() idAlmacen: number;                                             // parametro de entrada (almacen) 
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 
  @ViewChild('sbAlmacenes', { static: false }) sbAlmacenes: CmdSelectBoxComponent; 
  @ViewChild('txtUnidades', { static: false }) txtUnidades: DxNumberBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-articulos-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-articulos-buscar.btnSeleccionar', 'Seleccionar'), posicion: 2, accion: () => {this.btnSeleccionar()}, tipo: TipoBoton.success },
  ];

  str_txtUnidades:string = "";

  WSDatos_Validando: boolean = false;
  loadIndicatorVisible: boolean = true;
  
  // grid lista de artciculos-stock 
  // [IdAriculo, NombreArticulo, IdAlmacen, NombreAlmacen, Unidades, IdCualidad, NombreCualidad, Secundario]
  arrayStockArticulos: Array<ArticuloStock>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-articulos-buscar.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-articulos-buscar.colNombreArticulo','Descripcion'),
      visible: true,
    },    
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-articulos-buscar.colIdAlmacen','IdAlmacen'),      
      visible: false,
    },
    {
      dataField: 'NombreAlmacen',
      caption: this.traducir('frm-articulos-buscar.colNombreAlmacen','Almacen'),
      visible: true,      
    },
    {
      dataField: 'Unidades',
      caption: this.traducir('frm-articulos-buscar.colUnidades','Unidades'),
      visible: true,
    },
    {
      dataField: 'IdCualidad',
      caption: this.traducir('frm-articulos-buscar.colIdCualidad','IdCualidad'),
      visible: false,
    },
    {
      dataField: 'NombreCualidad',
      caption: this.traducir('frm-articulos-buscar.colNombreCualidad','Cualidad'),
      visible: false,
    },
    // {
    //   dataField: 'Secundario',
    //   caption: this.traducir('frm-articulos-buscar.colFechaStock','Secundario'),
    //   visible: true,
    // },
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );
  selectedRowsData = [];

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
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
    //this.cargarStock();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo',this.traducir('frm-articulos-buscar.TotalRegistros','Total Registros: '),'count');

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.panelBusqueda(true);
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);

    // seleccion del almacen de busqueda
    let index:number = this.almacenes.findIndex(e => e.IdAlmacen == this.idAlmacen);
    if (index<0) { this.sbAlmacenes.SelectBox.value=this.almacenes[0].IdAlmacen; }
    else {this.sbAlmacenes.SelectBox.value=this.almacenes[index].IdAlmacen;}
    this.sbAlmacenes.SelectBox.readOnly = true;
    
    // foco
    this.dg.DataGrid.instance.focus();    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
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
  
  async cargarStock(almacen:number){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getStockArticulos(almacen)).subscribe(
      (datos) => {
        if (Utilidades.DatosWSCorrectos(datos)) {
          this.loadIndicatorVisible = true;
          // asignar valores devuletos
          this.arrayStockArticulos = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayStockArticulos, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayStockArticulos.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
          this.loadIndicatorVisible = false;
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-articulos-buscar.msgErrorWS_CargarArticulosStock','Error web-service obtener lista Articulos-Stock')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-articulos-buscar');
      }
    );
  }

  //#endregion 


  //#region -- botones de opciones principales

  salir() {
    //this.location.back();
    this.cerrarPopUp.emit(null);
  }

  btnSeleccionar(){
    if (!this.validarUnidades()) return;
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-buscar.msgErrorSelectLinea','Debe seleccionar un Artículo'));
      return;
    } else {   
      let retorno:any = {idArticulo:this.dg.objSeleccionado().IdArticulo , unidades:1}   
      this.cerrarPopUp.emit(retorno);   
    }
  }

  //#endregion


  validarUnidades():boolean {
    if (Utilidades.isEmpty(this.str_txtUnidades)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-buscar.msgErrorUnidadesVacias','Debe indicar un numero de unidades a solicitar'));
      setTimeout(() => {this.txtUnidades.instance.focus();}, 1000); 
      return false;
    }
    return true;
  }


  onDoubleClick_DataGrid(e){
    this.dg.DataGrid.instance.selectRowsByIndexes([e.dataIndex]);
    this.btnSeleccionar();
  }

  onValueChanged_ComboAlmacen(){
    this.cargarStock(this.sbAlmacenes.SelectBox.value);
  }

}
