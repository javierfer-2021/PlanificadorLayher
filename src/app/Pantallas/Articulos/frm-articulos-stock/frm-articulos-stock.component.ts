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
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { Almacen, Articulo, ArticuloStock } from 'src/app/Clases/Maestros';
import { DxPopupComponent } from 'devextreme-angular';


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
    //{ icono: '', texto: this.traducir('frm-articulos-stock.btnIncidencia', 'Incidencia'), posicion: 2, accion: () => {this.btnIncidencia()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-articulos-stock.btnEditar', 'Editar'), posicion: 2, accion: () => {this.btnEditar()}, tipo: TipoBoton.secondary },    
    { icono: '', texto: this.traducir('frm-articulos-stock.btnPlanificador', 'Ver Planificador'), posicion: 3, accion: () => {this.btnVerPlanificador()}, tipo: TipoBoton.secondary },
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
      width: 90,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "unpin",
          hint: "Marcar/Desmarcar como secundario",
          onClick: (e) => { 
            this.btnMarcarDesmarcarSecundario(e.row.data); 
          }
        },        
        { icon: "edit",
          hint: "Editar Artículo",
          onClick: (e) => { 
            //this.btnEditarArticulo(e.row.rowIndex); 
            this.btnEditarArticulo(e.row.data); 
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
  
    // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
  //popUp Filtros Adicionales
  @ViewChild('popUpVisibleEditar', { static: false }) popUpEditar: DxPopupComponent;
  popUpVisibleEditar:boolean = false;
  //articuloSeleccionado: Articulo = new Articulo();
  articuloSeleccionado: ArticuloStock = new ArticuloStock();

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
    this.dg.habilitarExportar('Articulos_Stock.xlsx');

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

  async actualizarValorSecundario(data:any){
    if (this.WSDatos_Validando) return;
    
    let articulo:string = data.IdAriculo;
    let almacen:number = data.IdAlmacen;
    let valor:boolean = !data.Secundario

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarArticuloValorSecundario(articulo,almacen,valor)).subscribe(
      (datos) => {
        if (Utilidades.DatosWSCorrectos(datos)) {
          // actualizar valor confirmado en datos grid memoria
          data.Secundario = valor;
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorWS_ActualizarValorSecundario','Error web-service actualizando valor Secundario')); 
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

  btnEditar(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorSelectLinea','Debe seleccionar un Artículo'));
      return;
    } else {
      this.btnEditarArticulo(this.dg.objSeleccionado());
    }
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
  btnVerPlanificador(){    
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorSelectLinea','Debe seleccionar un Artículo'));
      return;
    }
    let vArticulo : ArticuloStock =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-articulos-stock', idArticulo: vArticulo.IdArticulo }
    };
    this.router.navigate(['planificador_articulos'], navigationExtras);
  }

  //#endregion

  onDoubleClick_DataGrid(){
    // comprobar registro seleecionado
    let selectedRowsData = this.dg.DataGrid.instance.getSelectedRowsData();
    if ((selectedRowsData === null) || (selectedRowsData.length === 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-articulos-stock.msgErrorSelectLinea','Debe seleccionar un Artículo'));
      this.dg.DataGrid.instance.focus(); 
      return;
    } else {
      this.btnEditarArticulo(this.dg.objSeleccionado());
    }    
  }

  btnMarcarDesmarcarSecundario(data:any){
    // web-service para cambiar valor campo secundario del [articulo,almacen] indicado
    this.actualizarValorSecundario(data);
  }

  btnEditarArticulo(data:any){
    // datos del artículo. 
    this.articuloSeleccionado.IdArticulo = data.IdArticulo;
    this.articuloSeleccionado.NombreArticulo = data.NombreArticulo;
    this.articuloSeleccionado.IdFamilia = data.IdFamilia;
    this.articuloSeleccionado.IdSubfamilia = data.IdSubfamilia;
    this.articuloSeleccionado.Secundario = data.Secundario;
    // añadimos info almacen
    this.articuloSeleccionado.IdAlmacen = data.IdAlmacen;
    this.articuloSeleccionado.NombreAlmacen = data.NombreAlmacen;
    // ver popup edicion
    this.popUpVisibleEditar = true;
  }

  cerrarEditarArticulo(e){
    if (e != null) {     
      // Actualizar info del grid    
      this.cargarStock(this.sbAlmacenes.SelectBox.value);
    }
    this.popUpVisibleEditar = false;    
  }

  onValueChanged_ComboAlmacen(){
    this.cargarStock(this.sbAlmacenes.SelectBox.value);
  }


}
