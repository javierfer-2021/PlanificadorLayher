/* PANTALLA VISOR DE CONTRATOS AFECTADOS POR MODIFICACIONES EN VENTAS YA REGISTRADAS EN EL SISTEMA */
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Salida } from '../../../Clases/Salida';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';

@Component({
  selector: 'app-frm-contratos-afectados',
  templateUrl: './frm-contratos-afectados.component.html',
  styleUrls: ['./frm-contratos-afectados.component.css']
})
export class FrmContratosAfectadosComponent implements OnInit {

  @Input() _salida: Salida;                                               // salida modificada (salida referencia busqueda)
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-detalles.btnSalir', 'Salir'), visible:true, posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
  ];
 
  WSDatos_Validando: boolean = false;

  // grid lineas Salida
  arraySalidas: Array<Salida>;
  cols: Array<ColumnDataGrid> = [ 
    {
      dataField: 'IdSalida',
      caption: this.traducir('frm-venta-buscar.colIdSalida','Id.Salida'),
      visible: true,
    },      
    // {
    //   dataField: 'IdSalidaERP',
    //   caption: this.traducir('frm-venta-buscar.colIdSalidaERP','Id.Salida ERP'),
    //   visible: false,
    // },      
    {
      dataField: 'Contrato',
      caption: this.traducir('frm-venta-buscar.colContrato','Contrato'),
      visible: true,      
    },
    // {
    //   dataField: 'IdTipoDocumento',
    //   caption: this.traducir('frm-venta-buscar.colIdTipoDocumento','IdTipoDocumento'),
    //   visible: false,
    // },
    // {
    //   dataField: 'NombreTipoDocumento',
    //   caption: this.traducir('frm-venta-buscar.colNombreTipoDocumento','Tipo Contrato'),
    //   visible: true,
    // },   
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
    // {
    //   dataField: 'NumLineas',
    //   caption: this.traducir('frm-venta-buscar.colNumLineas','Num.Lineas'),
    //   visible: true,
    // },             
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 100, '', );

  //#endregion

  
  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              )  
    { }


  ngOnInit(): void {
    setTimeout(() => {this.cargarVentasAfectadas();},300);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // Totales + redimensionar grid, popUp
    this.dg.mostrarFilaSumaryTotal('IdLinea','IdArticulo',this.traducir('frm-venta-detalles.TotalRegistros','Total Lineas: '),'count');
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
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

  async cargarVentasAfectadas(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    let tipoCambio:number = 1;                                                              
    (await this.planificadorService.getSalidasAfectadas_CambioDatos(1,this._salida.IdSalida,this._salida.IdAlmacen,this._salida.FechaInicio,this._salida.FechaFin)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arraySalidas = datos.datos;
          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arraySalidas, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-contratos-afectados.msgError_WSCargarDatos','Error cargando datos salidas afectadas')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-contratos-afectados');
      }
    );
  } 

  //#endregion
  
  btnSalir() {
    //this.location.back();
    this.cerrarPopUp.emit(null);
  }


  // asignar color de lineas grid (normal, eliminada, insertada)
  onRowPrepared_DataGrid(e){ 
    if (e.rowType==="data") {
      if (e.data.Eliminada) { 
        e.rowElement.style.backgroundColor = '#FED2D2'
      }
      else if (e.data.Insertada){
        e.rowElement.style.backgroundColor = '#E3F9D3'
      }
    }
  }    

}
