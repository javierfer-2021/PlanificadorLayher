import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
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
import { Salida}  from '../../../Clases/Salida';
import { Entrada}  from '../../../Clases/Entrada';
import { Almacen } from 'src/app/Clases/Maestros';
import { Incidencia } from 'src/app/Clases/Incidencia';

import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';


@Component({
  selector: 'app-frm-incidencia-buscar-doc',
  templateUrl: './frm-incidencia-buscar-doc.component.html',
  styleUrls: ['./frm-incidencia-buscar-doc.component.css']
})
export class FrmIncidenciaBuscarDocComponent implements OnInit {

  @Input() incidencia: Incidencia;                                        // parametro de entrada (incidencia) 
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

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
    { icono: '', texto: this.traducir('frm-incidencia-buscar-doc.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia-buscar-doc.btnSeleccionar', 'Seleccionar'), posicion: 2, accion: () => {this.btnSeleccionar()}, tipo: TipoBoton.success },
  ];

  WSDatos_Validando: boolean = false;

  _tipoDocumento: number;
  //_documentoSeleccionado: DocumentoIncidencia = new (DocumentoIncidencia);

  // grid lista documento (entradas vs salidas) -> depende de tipo doc pasado como parametro en la busqueda
  arrayDocumento: Array<any> = [];
  cols: Array<ColumnDataGrid> = [];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );
  

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
    //this.cargarSalidas(-1);
    // Inicializar pantalla -> personalizacion tipo busqueda entradas vs salidas
    if (Utilidades.isEmpty(this.incidencia.IdTipoDocumento)) {
      Utilidades.ShowDialogError('No esta definido el tipo documento (entrada/salida) para la busqueda');
      this.salir();
    }
    this._tipoDocumento = this.incidencia.IdTipoDocumento;
    this.inicializarPantalla();    
  }

  inicializarPantalla(){
    if (this._tipoDocumento<30) {
      //this.arrayDocumento = new (Array<Salida>);
      this.cols = [
        {
          dataField: 'IdSalida',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdSalida','Id.Salida'),
          visible: false,
        },      
        {
          dataField: 'IdSalidaERP',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdSalidaERP','Id.Salida ERP'),
          visible: false,
        },      
        {
          dataField: 'Contrato',
          caption: this.traducir('frm-incidencia-buscar-doc.colContrato','Contrato'),
          visible: true,      
        },
        {
          dataField: 'IdTipoDocumento',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdTipoDocumento','IdTipoDocumento'),
          visible: false,
        },
        {
          dataField: 'NombreTipoDocumento',
          caption: this.traducir('frm-incidencia-buscar-doc.colNombreTipoDocumento','Tipo Contrato'),
          visible: true,
        },   
        {
          dataField: 'Planificar',
          caption: this.traducir('frm-incidencia-buscar-doc.colPlanificar','Planificar'),
          visible: true,
        },      
        {
          dataField: 'IdAlmacen',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdAlmacen','IdAlmacen'),
          visible: false,
        },
        {
          dataField: 'NombreAlmacen',
          caption: this.traducir('frm-incidencia-buscar-doc.colAlmacen','Almacen'),
          visible: true,
        },   
        {
          dataField: 'Referencia',
          caption: this.traducir('frm-incidencia-buscar-doc.colReferencia','Referencia'),
          visible: true,
        },
        {
          dataField: 'IdCliente',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdCliente','Id.Cliente'),      
          visible: false,
        },
        {
          dataField: 'IdClienteERP',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdClienteERP','Id.Cliente ERP'),      
          visible: true,
        },
        {
          dataField: 'NombreCliente',
          caption: this.traducir('frm-incidencia-buscar-doc.colNombreCliente','Nombre Cliente'),      
          visible: true,
        },    
        {
          dataField: 'IdEstado',
          caption: this.traducir('frm-incidencia-buscar-doc.colIdEstado','IdEstado'),
          visible: false,
        },
        {
          dataField: 'NombreEstado',
          caption: this.traducir('frm-incidencia-buscar-doc.colEstado','Estado'),
          visible: true,
        },
        {
          dataField: 'FechaAlta',
          caption: this.traducir('frm-incidencia-buscar-doc.colFechaAlta','Fecha Alta'),
          visible: false,
          dataType: 'date',
        },
        {
          dataField: 'FechaInicio',
          caption: this.traducir('frm-incidencia-buscar-doc.colFechaInicio','Fecha Inicio'),
          visible: true,
          dataType: 'date',
        },
        {
          dataField: 'FechaFin',
          caption: this.traducir('frm-incidencia-buscar-doc.colFechaFin','Fecha Fin'),
          visible: true,
          dataType: 'date',
        },
        {
          dataField: 'Obra',
          caption: this.traducir('frm-incidencia-buscar-doc.colObra','Obra'),
          visible: true,
        },
        {
          dataField: 'Observaciones',
          caption: this.traducir('frm-incidencia-buscar-doc.colObservaciones','Observaciones'),
          visible: false,
        },
        {
          dataField: 'NumLineas',
          caption: this.traducir('frm-incidencia-buscar-doc.colNumLineas','Num.Lineas'),
          visible: true,
        },             
      ];      
    } else {
      //this.arrayDocumento = new (Array<Entrada>);
      this.cols = [
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
          caption: this.traducir('frm-venta-buscar.colIdProveedorERP','Id.Prov.ERP'),      
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
    }
  }
  
  
  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdSalida','Contrato',this.traducir('frm-incidencia-buscar-doc.TotalRegistros','Total Salidas: '),'count');
    
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
  
  async cargarDocumentos(almacen=-1){
    if (this._tipoDocumento<30) {
      this.cargarSalidas(almacen);
    } else {
      this.cargarEntradas(almacen);
    }
  }

  async cargarSalidas(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getSalidasAlmacen(almacen,0,0,false)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayDocumento = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayDocumento, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayDocumento.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencia-buscar-doc.msgErrorWS_CargarSalidas','Error web-service obtener Lista Salidas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-incidencias-buscar-doc');
      }
    );
  }  

  async cargarEntradas(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getEntradasAlmacen(almacen, 0, 0, false)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayDocumento = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayDocumento, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayDocumento.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencia-buscar-doc.msgErrorWS_CargarEntradas','Error web-service obtener lista entradas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-incidencia-buscar-doc');
      }
    );
  }

  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.cerrarPopUp.emit(null);
  }

  btnSeleccionar(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia-buscar-doc.msgErrorSelectLinea','Debe seleccionar una documento'));
      return;
    } else {   
      let retorno:any = this.dg.objSeleccionado(); 
      if (this._tipoDocumento<30) {
        this.incidencia.IdDocumento = retorno.IdSalida;
        this.incidencia.IdTipoDocumento = retorno.IdTipoDocumento;
        this.incidencia.NombreTipoDocumento = retorno.NombreTipoDocumento
        this.incidencia.Contrato = retorno.Contrato;
        this.incidencia.IdCliProv = retorno.IdClienteERP;
        this.incidencia.NombreCliProv = retorno.NombreCliente;
      } else {
        this.incidencia.IdDocumento = retorno.IdEntrada;
        this.incidencia.IdTipoDocumento = retorno.IdTipoDocumento;
        this.incidencia.NombreTipoDocumento = retorno.NombreTipoDocumento
        this.incidencia.Contrato = retorno.Contrato;
        this.incidencia.IdCliProv = retorno.IdProveedorERP;
        this.incidencia.NombreCliProv = retorno.NombreProveedor;
      }        
      this.cerrarPopUp.emit(this.incidencia);   
    }
  }

  //#endregion

  onDoubleClick_DataGrid(){
    this.btnSeleccionar();
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
    this.cargarDocumentos(this.sbAlmacenes.SelectBox.value);
  }  


}
