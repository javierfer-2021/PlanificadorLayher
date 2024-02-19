import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../../Clases/Componentes/DataSelectBoxConfig';

import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';

import { Utilidades } from '../../../Utilidades/Utilidades';
import { Salida, filtrosBusqueda}  from '../../../Clases/Salida';
import { Almacen } from 'src/app/Clases/Maestros';

import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-venta-buscar',
  templateUrl: './frm-venta-buscar.component.html',
  styleUrls: ['./frm-venta-buscar.component.css']
})
export class FrmVentaBuscarComponent implements OnInit {

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
    { icono: '', texto: this.traducir('frm-venta-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-buscar.btnDetalles', 'Ver Detalles'), posicion: 2, accion: () => {this.verDetallesOferta()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-venta-buscar.btnPlanificador', 'Ver Planificador'), posicion: 3, accion: () => {this.verPlanificador()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-venta-buscar.btnImportar', 'Importar'), posicion: 4, accion: () => {this.verPantallaImportar()}, tipo: TipoBoton.success },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista ofertas
  // [IdSalida, IdSalidaERP, Contrato, Referencia, FechaAlta, FechaInicio, FechaFin, IdEstado, NombreEstado, IdCliente, IdClienteERP, NombreCliente,
  //  Obra, Observaciones, IdAlmacen, NombreAlmacen, IdTipoDocumento, NombreTipoDocumento, Planificar, NumLineas, Aviso]
  arraySalidas: Array<Salida>;
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
          hint: "Ver detalles salida",
          onClick: (e) => { 
            this.btnMostrarOferta(e.row.data); 
          }
        },
      ]
    },
    {
      dataField: 'IdSalida',
      caption: this.traducir('frm-venta-buscar.colIdSalida','Id.Salida'),
      visible: false,
    },      
    {
      dataField: 'IdSalidaERP',
      caption: this.traducir('frm-venta-buscar.colIdSalidaERP','Id.Salida ERP'),
      visible: false,
    },      
    {
      dataField: 'Contrato',
      caption: this.traducir('frm-venta-buscar.colContrato','Contrato'),
      visible: true,      
    },
    {
      dataField: 'IdTipoDocumento',
      caption: this.traducir('frm-venta-buscar.colIdTipoDocumento','IdTipoDocumento'),
      visible: false,
    },
    {
      dataField: 'NombreTipoDocumento',
      caption: this.traducir('frm-venta-buscar.colNombreTipoDocumento','Tipo Contrato'),
      visible: true,
    },   
    {
      dataField: 'Planificar',
      caption: this.traducir('frm-venta-buscar.colPlanificar','Planificar'),
      visible: true,
    },      
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-venta-buscar.colIdAlmacen','IdAlmacen'),
      visible: false,
    },
    {
      dataField: 'NombreAlmacen',
      caption: this.traducir('frm-venta-buscar.colAlmacen','Almacen'),
      visible: true,
    },   
    {
      dataField: 'Referencia',
      caption: this.traducir('frm-venta-buscar.colReferencia','Referencia'),
      visible: true,
    },
    {
      dataField: 'IdCliente',
      caption: this.traducir('frm-venta-buscar.colIdCliente','Id.Cliente'),      
      visible: false,
    },
    {
      dataField: 'IdClienteERP',
      caption: this.traducir('frm-venta-buscar.colIdClienteERP','Id.Cliente ERP'),      
      visible: true,
    },
    {
      dataField: 'NombreCliente',
      caption: this.traducir('frm-venta-buscar.colNombreCliente','Nombre Cliente'),      
      visible: true,
    },    
    {
      dataField: 'IdEstado',
      caption: this.traducir('frm-venta-buscar.colIdEstado','IdEstado'),
      visible: false,
    },
    {
      dataField: 'NombreEstado',
      caption: this.traducir('frm-venta-buscar.colEstado','Estado'),
      visible: true,
    },
    {
      dataField: 'FechaAlta',
      caption: this.traducir('frm-venta-buscar.colFechaAlta','Fecha Alta'),
      visible: false,
      dataType: 'date',
    },
    {
      dataField: 'FechaInicio',
      caption: this.traducir('frm-venta-buscar.colFechaInicio','Fecha Inicio'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'FechaFin',
      caption: this.traducir('frm-venta-buscar.colFechaFin','Fecha Fin'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'Obra',
      caption: this.traducir('frm-venta-buscar.colObra','Obra'),
      visible: true,
    },
    {
      dataField: 'Observaciones',
      caption: this.traducir('frm-venta-buscar.colObservaciones','Observaciones'),
      visible: false,
    },
    {
      dataField: 'NumLineas',
      caption: this.traducir('frm-venta-buscar.colNumLineas','Num.Lineas'),
      visible: true,
    },             
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );

  selectedRowsData = [];

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
  //popUp Filtros Adicionales
  @ViewChild('popUpFiltros', { static: false }) popUpFiltros: DxPopupComponent;
  popUpVisibleFiltros:boolean = false;
  filtrosAdicionales:filtrosBusqueda; 
  filtrosActivos:boolean = false;

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
    // inicializacion filtros 
    this.filtrosAdicionales= new filtrosBusqueda();
    this.filtrosAdicionales.mostrarCanceladas=false;
    this.filtrosAdicionales.buscarSinConfirmar=false;
    this.filtrosAdicionales.diasSinConfirmar=ConfiGlobal.configLayher.DiasPermitidosSinConfirmar;
    this.filtrosAdicionales.valorContiene=true;
    this.filtrosAdicionales.IdArticulo='';
    this.filtrosAdicionales.IdFamilia=0;
    this.filtrosAdicionales.IdSubfamilia=0;    
    this.filtrosAdicionales.otros='';
  }

  ngOnInit(): void {
    //this.cargarSalidas(-1);
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdSalida','Contrato',this.traducir('frm-venta-buscar.TotalRegistros','Total Salidas: '),'count');
    this.dg.habilitarExportar('Ventas_Planificador.xlsx');
    
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
  
  async cargarSalidas(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getSalidasAlmacen(almacen,
                                                      this.filtrosAdicionales.IdArticulo, this.filtrosAdicionales.IdFamilia,this.filtrosAdicionales.IdSubfamilia,
                                                      this.filtrosAdicionales.mostrarCanceladas,
                                                      this.filtrosAdicionales.valorContiene,
                                                      this.filtrosAdicionales.otros)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arraySalidas = datos.datos;
          this.dgConfig = new DataGridConfig(this.arraySalidas, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arraySalidas.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-ventas-buscar.msgErrorWS_CargarSalidas','Error web-service obtener Lista Salidas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-ventas-buscar');
      }
    );
  }

  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  verDetallesOferta(){
    this.selectedRowsData = this.dg.DataGrid.instance.getSelectedRowsData();
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-buscar.msgErrorSelectLinea','Debe seleccionar una oferta'));
      return;
    }
    let vSalida : Salida =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-venta-buscar', Salida: vSalida }
    };
    this.router.navigate(['venta_detalle'], navigationExtras);
  }

  verPlanificador(){
    // comprobar registro seleccionado
    this.selectedRowsData = this.dg.DataGrid.instance.getSelectedRowsData();
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-buscar.msgErrorSelectLinea','Debe seleccionar una oferta'));
      this.dg.DataGrid.instance.focus(); 
      return;
    } 
    else {
      // ir a pantalla planificador con parametro router salida_seleccionada
      let vSalida : Salida =  this.dg.objSeleccionado();    
      if (vSalida.IdEstado<99) {
        const navigationExtras: NavigationExtras = {
          state: { PantallaAnterior: 'frm-venta-buscar', salida: vSalida }
        };
        this.router.navigate(['planificador'], navigationExtras); 
      } else {
        Utilidades.ShowDialogAviso('Contrato Salida CANCELADO.<br>No es posible ver la planificación asodiada');
      }
    }
  }

  verPantallaImportar() {
    this.router.navigate(['venta_importar']);
  }

  //#endregion

  onDoubleClick_DataGrid(){
    this.verPlanificador();
  }


  btnMostrarOferta(data:any){
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
    this.cargarSalidas(this.sbAlmacenes.SelectBox.value);
  }  

  seleccionarFiltrosAdicionales(){
    this.popUpVisibleFiltros = true;
  }

  cerrarFiltrosAdicionales(e){
    if ((e != null) && (this.checkCambioFiltros(e)) ){
      this.filtrosAdicionales.IdArticulo=e.IdArticulo;
      this.filtrosAdicionales.IdFamilia=e.IdFamilia;
      this.filtrosAdicionales.IdSubfamilia=e.IdSubfamilia;
      this.filtrosAdicionales.valorContiene=e.valorContiene;
      this.filtrosAdicionales.mostrarCanceladas=e.mostrarCanceladas;
      this.filtrosAdicionales.otros='';
      if (this.filtrosAdicionales.buscarSinConfirmar){
        this.filtrosAdicionales.otros=' SAL_ID_ESTADO=1 AND CAST(GETDATE() AS Date) >= DATEADD(day,'+ this.filtrosAdicionales.diasSinConfirmar.toString() +', CAST([SAL_FECHA_ALTA] AS Date)) ';
      }
      // marcar si hay filtros especiales activos
      this.filtrosActivos = ((this.filtrosAdicionales.IdArticulo!='') || (this.filtrosAdicionales.IdFamilia>0) || (this.filtrosAdicionales.IdSubfamilia>0) || (this.filtrosAdicionales.mostrarCanceladas) || (this.filtrosAdicionales.buscarSinConfirmar))
      // refrescamos consulta contratos Salida
      this.cargarSalidas(this.sbAlmacenes.SelectBox.value);
    }
    this.popUpVisibleFiltros = false;
  }

  checkCambioFiltros(nuevoFiltro:filtrosBusqueda):boolean {
    if (this.filtrosAdicionales.mostrarCanceladas != nuevoFiltro.mostrarCanceladas) return true;
    if (this.filtrosAdicionales.buscarSinConfirmar != nuevoFiltro.buscarSinConfirmar) return true;
    if (this.filtrosAdicionales.diasSinConfirmar != nuevoFiltro.diasSinConfirmar) return true;
    if (this.filtrosAdicionales.valorContiene != nuevoFiltro.valorContiene) return true;
    if (this.filtrosAdicionales.IdArticulo != nuevoFiltro.IdArticulo) return true;
    if (this.filtrosAdicionales.IdFamilia != nuevoFiltro.IdFamilia) return true;
    if (this.filtrosAdicionales.IdSubfamilia != nuevoFiltro.IdSubfamilia) return true;    
    return false;
  }

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }
}
