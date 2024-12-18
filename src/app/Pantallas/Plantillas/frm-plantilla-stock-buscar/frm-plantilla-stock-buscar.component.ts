import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';

import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { DataSelectBoxConfig } from '../../../Clases/Componentes/DataSelectBoxConfig';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';

import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlantillaStock } from '../../../Clases/PlantillaStock';
import { Almacen } from 'src/app/Clases/Maestros';

import { locale } from 'devextreme/localization';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-plantilla-stock-buscar',
  templateUrl: './frm-plantilla-stock-buscar.component.html',
  styleUrls: ['./frm-plantilla-stock-buscar.component.css']
})
export class FrmPlantillaStockBuscarComponent implements OnInit {

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
    { icono: '', texto: this.traducir('frm-plantilla-stock-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-plantilla-stock-buscar.btnInsertar', 'Nueva Plantilla'), posicion: 2, accion: () => {this.btnInsertarPlantilla()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-plantilla-stock-buscar.btnDetalles', 'Ver Detalles'), posicion: 3, accion: () => {this.btnVerDetallesPlantilla()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-plantilla-stock-buscar.btnConsultarStock', 'Consultar Stock'), posicion: 4, accion: () => {this.verPantallaConsultaStock()}, tipo: TipoBoton.secondary },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista Entradas
  // [IdEntrada, IdEntradaERP, Contrato, Referencia, FechaAlta, FechaPrevista, FechaConfirmada, IdEstado, NombreEstado, IdProveedor, IdProveedorERP, NombreProveedor,
  //  Observaciones, IdAlmacen, NombreAlmacen, IdTipoDocumento, NombreTipoDocumento, Confirmada, NumLineas]
  arrayPlantillasStock: Array<PlantillaStock>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: false,
      type: "buttons",
      width: 40,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "info",
          hint: "Ver detalles entrada",
          onClick: (e) => { 
            this.btnMostrarOferta(e.row.rowIndex); 
          }
        },
      ]
    },
    {
      dataField: 'IdPlantilla',
      caption: this.traducir('frm-plantilla-stock-buscar.colIdPlantilla','Id.Plantilla'),
      visible: false,
    },      
    {
      dataField: 'IdNombrePlantilla',
      caption: this.traducir('frm-plantilla-stock-buscar.colNombrePlantilla','Nombre Plantilla'),
      visible: true,
    },      
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-plantilla-stock-buscar.colIdAlmacen','Id.Almacen'),
      visible: false,      
    },
    {
      dataField: 'NombreAlmacen',
      caption: this.traducir('frm-plantilla-stock-buscar.colNombreAlmacen','Almacen'),
      visible: true,
    },
    {
      dataField: 'Fecha',
      caption: this.traducir('frm-plantilla-stock-buscar.colFecha','Fecha'),
      visible: true,
    },   
    {
      dataField: 'Descripcion',
      caption: this.traducir('frm-plantilla-stock-buscar.colDescripcion','Descripcion'),
      visible: true,
    },      
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );

  selectedRowsData = [];

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);

  //popUp Filtros Adicionales
  // @ViewChild('popUpFiltros', { static: false }) popUpFiltros: DxPopupComponent;
  // popUpVisibleFiltros:boolean = false;
  // filtrosAdicionales:filtrosBusqueda; 
  // filtrosActivos:boolean = false;

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
              public planificadorService: PlanificadorService) 
  { 
    // Asignar localizacion ESPAÑA
    locale('es');
    // // inicializacion filtros    
    // this.filtrosAdicionales= new filtrosBusqueda();
    // this.filtrosAdicionales.mostrarCanceladas=false;
    // this.filtrosAdicionales.valorContiene=true;
    // this.filtrosAdicionales.IdArticulo='';
    // this.filtrosAdicionales.IdFamilia=0;
    // this.filtrosAdicionales.IdSubfamilia=0;    
    // this.filtrosAdicionales.otros='';    

  }

  ngOnInit(): void {
    //this.cargarOfertas();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdPlantilla','NombrePlantilla',this.traducir('frm-plantilla-stock-buscar.TotalRegistros','Nº Plantillas: '),'count');
    //this.dg.habilitarExportar('Compras_Planificador.xlsx');

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.panelBusqueda(true);
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);
    
    // seleccion almacen por defecto -> evento cambio carga datos.
    this.seleccionarAlmacenDefecto();
    
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
  
  async cargarPlantillasStock(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getPlantillasStockAlmacen(almacen)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayPlantillasStock = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayPlantillasStock, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayPlantillasStock.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock-buscar.msgErrorWS_CargarEntradas','Error web-service obtener lista entradas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock-buscar');
      }
    );
  }
  
  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  btnInsertarPlantilla(){
    let vPlantilla : PlantillaStock = new PlantillaStock();
    vPlantilla.IdPlantilla= -1;
    vPlantilla.Fecha = new Date();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-plantilla-stock-buscar', Plantilla: vPlantilla }
    };
    this.router.navigate(['plantillas_stock'], navigationExtras);

  }

  btnVerDetallesPlantilla(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock-buscar.msgErrorSelectLinea','Debe seleccionar una Plantilla'));
      return;
    }
    let vPlantilla : PlantillaStock =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-plantilla-stock-buscar', Plantilla: vPlantilla }
    };
    this.router.navigate(['plantillas_stock'], navigationExtras);

  }


  verPantallaConsultaStock() {
    this.router.navigate(['compra_importar']);
  }

  //#endregion

  onDoubleClick_DataGrid(e){
    this.dg.DataGrid.instance.selectRowsByIndexes([e.dataIndex]);
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
    this.btnVerDetallesPlantilla();
    }   
  }

  btnMostrarOferta(index:number){
    // ICONO DEL GRID. oculto no implementado -> se usa boton Ver Detalles Oefrta
  }

  seleccionarAlmacenDefecto(){
    if ((this.almacenes.findIndex(x => x.IdAlmacen == ConfiGlobal.DatosUsuario.idAlmacenDefecto))<0) {
      this.sbAlmacenes.SelectBox.value=this.almacenes[0].IdAlmacen;
    }
    else {      
      this.sbAlmacenes.SelectBox.value=ConfiGlobal.DatosUsuario.idAlmacenDefecto;
    }
  }

  onValueChanged_ComboAlmacen(){
    this.cargarPlantillasStock(this.sbAlmacenes.SelectBox.value);
  } 

  // seleccionarFiltrosAdicionales(){
  //   this.popUpVisibleFiltros = true;
  // }

  // cerrarFiltrosAdicionales(e){
  //   if ((e != null) && (this.checkCambioFiltros(e)) ){
  //     this.filtrosAdicionales.IdArticulo=e.IdArticulo;
  //     this.filtrosAdicionales.IdFamilia=e.IdFamilia;
  //     this.filtrosAdicionales.IdSubfamilia=e.IdSubfamilia;
  //     this.filtrosAdicionales.valorContiene=e.valorContiene;
  //     this.filtrosAdicionales.mostrarCanceladas=e.mostrarCanceladas;
  //     this.filtrosAdicionales.otros='';
  //     // marcar si hay filtros especiales activos
  //     this.filtrosActivos = ((this.filtrosAdicionales.IdArticulo!='') || (this.filtrosAdicionales.IdFamilia>0) || (this.filtrosAdicionales.IdSubfamilia>0) || (this.filtrosAdicionales.mostrarCanceladas))
  //     // refrescamos consulta contratos ENTRADA
  //     this.cargarEntradas(this.sbAlmacenes.SelectBox.value);
  //   }
  //   this.popUpVisibleFiltros = false;
  // }

  // checkCambioFiltros(nuevoFiltro:filtrosBusqueda):boolean {
  //   if (this.filtrosAdicionales.mostrarCanceladas != nuevoFiltro.mostrarCanceladas) return true;
  //   if (this.filtrosAdicionales.valorContiene != nuevoFiltro.valorContiene) return true;
  //   if (this.filtrosAdicionales.IdArticulo != nuevoFiltro.IdArticulo) return true;
  //   if (this.filtrosAdicionales.IdFamilia != nuevoFiltro.IdFamilia) return true;
  //   if (this.filtrosAdicionales.IdSubfamilia != nuevoFiltro.IdSubfamilia) return true;    
  //   return false;
  // }

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }

}

