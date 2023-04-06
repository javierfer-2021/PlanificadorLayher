import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../../Clases/Componentes/DataSelectBoxConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { ArticuloStock } from '../../../Clases/Articulo';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { Almacen } from 'src/app/Clases/Maestros';


@Component({
  selector: 'app-frm-articulos-stock',
  templateUrl: './frm-articulos-stock.component.html',
  styleUrls: ['./frm-articulos-stock.component.css']
})
export class FrmArticulosStockComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 
  @ViewChild('sbAlmacenes', { static: false }) sbAlmacenes: CmdSelectBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-articulos-stock.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-articulos-stock.btnIncidencia', 'Incidencia'), posicion: 2, accion: () => {this.btnIncidencia()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-articulos-stock.btnPlanificador', 'Ver Planificador'), posicion: 3, accion: () => {this.btnRegularizar()}, tipo: TipoBoton.secondary },
  ];

  WSDatos_Validando: boolean = false;
  loadIndicatorVisible: boolean = true;

  
  // grid lista de artciculos-stock 
  // [IdAriculo, NombreArticulo, IdAlmacen, NombreAlmacen, Unidades, IdCualidad, NombreCualidad, Secundario]
  arrayStockArticulos: Array<ArticuloStock>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 40,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "edit",
          hint: "Editar Artículo",
          onClick: (e) => { 
            this.btnEditarArticulo(e.row.rowIndex); 
          }
        },
      ]
    },
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-articulos-stock.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-articulos-stock.colNombreArticulo','Descripcion'),
      visible: true,
    },    
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-articulos-stock.colIdAlmacen','IdAlmacen'),      
      visible: false,
    },
    {
      dataField: 'NombreAlmacen',
      caption: this.traducir('frm-articulos-stock.colNombreAlmacen','Almacen'),
      visible: true,      
    },
    {
      dataField: 'Unidades',
      caption: this.traducir('frm-articulos-stock.colUnidades','Unidades'),
      visible: true,
    },
    {
      dataField: 'IdFamilia',
      caption: this.traducir('frm-articulos-stock.colIdFamilia','IdFamilia'),
      visible: false,
    },
    {
      dataField: 'NombreFamilia',
      caption: this.traducir('frm-articulos-stock.colNombreFamilia','Familia'),
      visible: true,
    }, 
    {
      dataField: 'IdSubfamilia',
      caption: this.traducir('frm-articulos-stock.colIdSubfamilia','IdSubfamilia'),
      visible: false,
    },
    {
      dataField: 'NombreSubfamilia',
      caption: this.traducir('frm-articulos-stock.colNombreSubfamilia','Subfamilia'),
      visible: true,
    },            
    {
      dataField: 'IdCualidad',
      caption: this.traducir('frm-articulos-stock.colIdCualidad','IdCualidad'),
      visible: false,
    },
    {
      dataField: 'NombreCualidad',
      caption: this.traducir('frm-articulos-stock.colNombreCualidad','Cualidad'),
      visible: false,
    },
    {
      dataField: 'Secundario',
      caption: this.traducir('frm-articulos-stock.colFechaStock','Secundario'),
      visible: true,
      width: 100,
    },
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
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo',this.traducir('frm-articulos-stock.TotalRegistros','Total Registros: '),'count');

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.panelBusqueda(true);
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);

    // seleccion por defecto Todos los almacenes -> evento cambio carga datos.
    this.sbAlmacenes.SelectBox.value=this.almacenes[0].IdAlmacen;
    
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
          Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorWS_CargarArticulosStock','Error web-service obtener lista Articulos-Stock')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-articulos-stock');
      }
    );
  }

  //#endregion 

  
  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  btnIncidencia(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorSelectLinea','Debe seleccionar un Artículo'));
      return;
    }
    let vArticulo : ArticuloStock =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-articulos-stock', idArticulo: vArticulo.IdArticulo }
    };
    this.router.navigate(['incidencia'], navigationExtras);
  }


  // regularizar stock --> Importar, Cambiar valor, etc... (ver si se implementa)  
  btnRegularizar(){    
    try { alert('Gestión de regularización stock Articulo -> '+ this.dg.objSeleccionado().IdArticulo); } catch {} 
  }

  //#endregion

  onDoubleClick_DataGrid(){
    // añadir codigo doble-click sobre el grid
  }

  btnEditarArticulo(index:number){
    // ICONO DEL GRID. oculto no implementado -> se usa boton Ver Detalles 
    alert('Pantalla edicion articulo');
  }

  onValueChanged_ComboAlmacen(){
    this.cargarStock(this.sbAlmacenes.SelectBox.value);
  }


}
