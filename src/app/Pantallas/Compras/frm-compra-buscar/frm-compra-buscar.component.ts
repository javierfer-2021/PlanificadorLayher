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
import { Entrada } from '../../../Clases/Entrada';
import { Almacen } from 'src/app/Clases/Maestros';

import { locale } from 'devextreme/localization';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-compra-buscar',
  templateUrl: './frm-compra-buscar.component.html',
  styleUrls: ['./frm-compra-buscar.component.css']
})
export class FrmCompraBuscarComponent implements OnInit {

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
    { icono: '', texto: this.traducir('frm-compra-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-compra-buscar.btnDetalles', 'Ver Detalles'), posicion: 2, accion: () => {this.verDetallesEntrada()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-compra-buscar.btnImportar', 'Importar'), posicion: 3, accion: () => {this.verPantallaImportar()}, tipo: TipoBoton.secondary },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista Entradas
  // [IdEntrada, IdEntradaERP, Contrato, Referencia, FechaAlta, FechaPrevista, FechaConfirmada, IdEstado, NombreEstado, IdProveedor, IdProveedorERP, NombreProveedor,
  //  Observaciones, IdAlmacen, NombreAlmacen, IdTipoDocumento, NombreTipoDocumento, Confirmada, NumLineas]
  arrayEntradas: Array<Entrada>;
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
      dataField: 'IdEntrada',
      caption: this.traducir('frm-venta-buscar.colIdEntrada','Id.Entrada'),
      visible: false,
    },      
    {
      dataField: 'IdEntradaERP',
      caption: this.traducir('frm-venta-buscar.colIdEntradaERP','Id.Entrada ERP'),
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
      dataField: 'Confirmada',
      caption: this.traducir('frm-venta-buscar.colConfirmada','Confirmada'),
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
      dataField: 'IdProveedor',
      caption: this.traducir('frm-venta-buscar.colIdProveedor','Id.Proveedor'),      
      visible: false,
    },
    {
      dataField: 'IdProveedorERP',
      caption: this.traducir('frm-venta-buscar.colIdProveedorERP','Id.ProveedorERP'),      
      visible: true,
    },
    {
      dataField: 'NombreProveedor',
      caption: this.traducir('frm-venta-buscar.colNombreProveedor','Nombre Proveedor'),      
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
      dataField: 'FechaPrevista',
      caption: this.traducir('frm-venta-buscar.colFechaPrevista','Fecha Prevista'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'FechaConfirmada',
      caption: this.traducir('frm-venta-buscar.colFechaConfirmada','Fecha Confirmada'),
      visible: true,
      dataType: 'date',
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
    //this.cargarOfertas();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdEntrada','Contrato',this.traducir('frm-compra-buscar.TotalRegistros','Total Entradas: '),'count');
    this.dg.habilitarExportar('Compras_Planificador.xlsx');

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
  
  async cargarEntradas(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getEntradasAlmacen(almacen)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayEntradas = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayEntradas, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayEntradas.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-compra-buscar.msgErrorWS_CargarEntradas','Error web-service obtener lista entradas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-compra-buscar');
      }
    );
  }
  
  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  verDetallesEntrada(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-compra-buscar.msgErrorSelectLinea','Debe seleccionar una Entrada'));
      return;
    }
    let vEntrada : Entrada =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-compra-buscar', Entrada: vEntrada }
    };
    this.router.navigate(['compra_detalle'], navigationExtras);

  }


  verPantallaImportar() {
    this.router.navigate(['compra_importar']);
  }

  //#endregion

  onDoubleClick_DataGrid(e){
    this.dg.DataGrid.instance.selectRowsByIndexes([e.dataIndex]);
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
    this.verDetallesEntrada();
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
    this.cargarEntradas(this.sbAlmacenes.SelectBox.value);
  } 

  seleccionarFiltrosAdicionales(){
    this.popUpVisibleFiltros = true;
  }

  cerrarFiltrosAdicionales(e){
    if (e != null) {
      alert('Funcion de filtro no implementada')
    }
    this.popUpVisibleFiltros = false;
  }
}
