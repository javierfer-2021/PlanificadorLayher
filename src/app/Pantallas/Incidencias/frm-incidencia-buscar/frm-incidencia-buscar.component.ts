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
import { Incidencia } from 'src/app/Clases/Incidencia';

@Component({
  selector: 'app-frm-incidencia-buscar',
  templateUrl: './frm-incidencia-buscar.component.html',
  styleUrls: ['./frm-incidencia-buscar.component.css']
})
export class FrmIncidenciaBuscarComponent implements OnInit {


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
    { icono: '', texto: this.traducir('frm-incidencia-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia-buscar.btnVerIncidencia', 'Ver Incidencia'), posicion: 2, accion: () => {this.btnVerDetallesIncidencia()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-incidencia-buscar.btnCrearIncidencia', 'Crear Incidencia'), posicion: 3, accion: () => {this.btnCrearIncidencia()}, tipo: TipoBoton.success },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista ofertas
  // IdIncidencia, FechaAlta, FechaIncidencia, IdTipoIncidencia, NombreTipoIncidencia, IdAlmacen, NombreAlmacen, IdTipoDocumento, NombreTipoDocumento,
  // Contrato, IdArticulo, NombreArticulo, Unidades, Observaciones

  arrayIncidencias: Array<Incidencia>;
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
            this.btnGridVerDetallesIncidencia(e.row.data); 
          }
        },
      ]
    },
    {
      dataField: 'IdIncidencia',
      caption: this.traducir('frm-incidencia-buscar.colIdIncidencia','Id.Incidencia'),
      visible: true,
    },    
    {
      dataField: 'FechaAlta',
      caption: this.traducir('frm-incidencia-buscar.colFechaAlta','Fecha Alta'),
      visible: false,
      dataType: 'date',
    },
    {
      dataField: 'FechaIncidencia',
      caption: this.traducir('frm-incidencia-buscar.colFechaIncidencia','Fec.Incidencia'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'Descripcion',
      caption: this.traducir('frm-incidencia-buscar.colDescripcion','Descripción'),
      visible: true,
    },    
    {
      dataField: 'IdTipoIncidencia',
      caption: this.traducir('frm-incidencia-buscar.colIdTipoIncidencia','IdTipoIncidencia'),
      visible: false,
    },
    {
      dataField: 'NombreTipoIncidencia',
      caption: this.traducir('frm-incidencia-buscar.colNombreTipoIncidencia','TipoIncidencia'),
      visible: true,
    },
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-incidencia-buscar.colIdAlmacen','IdAlmacen'),
      visible: false,
    },
    {
      dataField: 'NombreAlmacen',
      caption: this.traducir('frm-incidencia-buscar.colAlmacen','Almacen'),
      visible: true,
    },  
    {
      dataField: 'IdTipoDocumento',
      caption: this.traducir('frm-incidencia-buscar.colIdTipoDocumento','IdTipoDocumento'),
      visible: false,
    },
    {
      dataField: 'NombreTipoDocumento',
      caption: this.traducir('frm-incidencia-buscar.colNombreTipoDocumento','Tipo Contrato'),
      visible: true,
    },   
    {
      dataField: 'Contrato',
      caption: this.traducir('frm-incidencia-buscar.colContrato','Contrato'),
      visible: true,      
    },    
    {
      dataField: 'IdCliProv',
      caption: this.traducir('frm-incidencia-buscar.colIdCliProv','Id.Cli/Prov'),
      visible: true,
    },
    {
      dataField: 'NombreCliProv',
      caption: this.traducir('frm-incidencia-buscar.colNombreCliProv','Nombre Cli/Prov'),
      visible: true,
    },
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-incidencia-buscar.colIdArticulo','IdArticulo'),
      visible: true,
    },
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-incidencia-buscar.colNombreArticulo','NombreArticulo'),      
      visible: false,
    },
    {
      dataField: 'Unidades',
      caption: this.traducir('frm-incidencia-buscar.colUnidades','Unidades'),      
      visible: true,
    },
    {
      dataField: 'NombreCliente',
      caption: this.traducir('frm-incidencia-buscar.colNombreCliente','Nombre Cliente'),      
      visible: true,
    },    
    {
      dataField: 'Observaciones',
      caption: this.traducir('frm-incidencia-buscar.colObservaciones','Observaciones'),
      width: 250,
      visible: true,      
    },
    {
      dataField: 'IdUsuario',
      caption: this.traducir('frm-incidencia-buscar.colIdUsuario','IdUsuario'),
      visible: false,
    },

  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );

  selectedRowsData = [];

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
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
  }

  ngOnInit(): void {
    //this.cargarIncidencias(-1);  -> se carga en evento change de combo almacenes
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdIncidencia','IdIncidencia',this.traducir('frm-incidencia-buscar.TotalRegistros','Total Incidencias: '),'count');
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

  //#region -- web service --

  async cargarIncidencias(almacen=-1){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getIncidenciasAlmacen(almacen)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayIncidencias = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayIncidencias, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayIncidencias.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencias-buscar.msgErrorWS_CargarIncidencias','Error web-service obtener Lista Incidencias')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-incidencias-buscar');
      }
    );
  }

  //#endregion


  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  btnVerDetallesIncidencia(){
    this.selectedRowsData = this.dg.DataGrid.instance.getSelectedRowsData();
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia-buscar.msgErrorSelectLinea','Debe seleccionar una Incidencia'));
      return;
    }
    let vIncidencia : Salida =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-incidencia-buscar', incidencia: vIncidencia }
    };
    this.router.navigate(['incidencia'], navigationExtras);
  }

  btnCrearIncidencia(){
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-incidencia-buscar', incidencia: null }
    };
    this.router.navigate(['incidencia'], navigationExtras); 
  }


  btnGridVerDetallesIncidencia(data:any){
    // ICONO DEL GRID. oculto no implementado -> se usa boton Ver Detalles Oefrta
  }

  //#endregion


  onDoubleClick_DataGrid(){
    this.btnVerDetallesIncidencia();
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
    this.cargarIncidencias(this.sbAlmacenes.SelectBox.value);
  }  

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }

}
