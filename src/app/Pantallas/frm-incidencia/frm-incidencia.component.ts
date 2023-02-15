import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../Utilidades/Utilidades';
import { Oferta, OfertaLinea, EstadoOferta, Almacen} from '../../Clases/Oferta';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent,DxTextBoxComponent, DxPopupComponent, DxTextAreaModule, DxSelectBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-frm-incidencia',
  templateUrl: './frm-incidencia.component.html',
  styleUrls: ['./frm-incidencia.component.css']
})
export class FrmIncidenciaComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formOferta', { static: false }) formOferta: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-incidencia.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia.btnCancelar', 'Cancelar'), posicion: 2, accion: () => {this.btnCancelarOferta()}, tipo: TipoBoton.secondary },
  ];
  
  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  _oferta: Oferta = new(Oferta);
  arrayTiposEstadoOferta: Array<EstadoOferta> = [];  
  arrayAlmacenes: Array<Almacen> = [];  

  ficheroCsv: File = null;

  // grid lineas oferta
  // [IdOferta,  IdLinea, IdArticulo, ArticuloNombre, CantidadPedida, CantidadReservada, CantidadDisponible, FechaActualizacion ]
  arrayLineasOferta: Array<OfertaLinea>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: 'IdOferta',
      caption: this.traducir('frm-incidencia.colIdOferta','Oferta'),
      visible: false,
    }, 
    {
      dataField: 'IdLinea',
      caption: this.traducir('frm-incidencia.colIdLinea','Linea'),
      visible: false,
    },     
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-incidencia.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'ArticuloNombre',
      caption: this.traducir('frm-incidencia.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-incidencia.colUndPedidas','Und.Pedidas'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'CantidadReservada',
      caption: this.traducir('frm-incidencia.colUndPedidas','Und.Reservadas'),      
      visible: true,
      width: 150,
    },    
    {
      dataField: 'CantidadDisponible',
      caption: this.traducir('frm-incidencia.colUndDisponibles','Disponibles'),      
      visible: true,
      width: 150,
    },   
    {
      dataField: 'FechaActualizacion',
      caption: this.traducir('frm-incidencia.colAvisos','Fec.Actualización'),
      visible: false,
    },       
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
    { 
      // obtenemos dato identificacion de envio del routing
      // const nav = this.router.getCurrentNavigation().extras.state;      
      // if (( nav.oferta !== null) && ( nav.oferta !== undefined)) {
      //   this._oferta= nav.oferta;
      // }
    }


  ngOnInit(): void {
    // this.cargarCombos();
    // setTimeout(() => {this.cargarLineasOferta();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
    // foco 
    this.formOferta.instance.getEditor('Referencia').focus();
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

  async cargarCombos(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getCombos_PantallaOfertas()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposEstadoOferta = datos.datos.ListaEstados;
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async cargarLineasOferta(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getLineasOferta(this._oferta.IdOferta)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayLineasOferta = datos.datos;
          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasOferta, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-detalles.msgError_WSCargarLineas','Error cargando lineas de la oferta')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  } 

  //#endregion
  
  btnSalir() {
    this.location.back();
  }

  btnCancelarOferta(){
    alert('Función no implementada')
  }
}



