import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Salida, SalidaLinea, EstadoSalida } from '../../../Clases/Salida';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-frm-venta-detalles',
  templateUrl: './frm-venta-detalles.component.html',
  styleUrls: ['./frm-venta-detalles.component.css']
})
export class FrmVentaDetallesComponent implements OnInit, AfterViewInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formSalida', { static: false }) formSalida: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-detalles.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-detalles.btnEditar', 'Editar'), posicion: 2, accion: () => {this.btnEditarSalida()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-venta-detalles.btnPlanificar', 'Planificar'), posicion: 3, accion: () => {this.btnPlanificarSalida()}, tipo: TipoBoton.success },
  ];

  btnAcionesEdicion: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  _salida: Salida = new(Salida);
  arrayTiposEstadoSalida: Array<EstadoSalida> = [];  
  arrayAlmacenes: Array<Almacen> = [];
  requerirFechaFin:boolean = false;  

  modoEdicion: boolean = false;
  _salidaCopia: Salida = new(Salida);

  // grid lineas Salida
  // [IdSalida,  IdLinea, IdArticulo, NombreArticulo, CantidadPedida, CantidadReservada, CantidadDisponible, FechaActualizacion ]
  arrayLineasSalida: Array<SalidaLinea>;
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
        { icon: "edit",
          hint: "Editar Linea",
          onClick: (e) => { 
            this.btnEditarLineaSalida(e.row.rowIndex); 
          }
        },
      ]
    },    
    {
      dataField: 'IdSalida',
      caption: this.traducir('frm-venta-detalles.colIdSalida','Salida'),
      visible: false,
    }, 
    {
      dataField: 'IdLinea',
      caption: this.traducir('frm-venta-detalles.colIdLinea','Linea'),
      visible: false,
    },     
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-venta-detalles.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-venta-detalles.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-venta-detalles.colUndPedidas','Und.Pedidas'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'CantidadReservada',
      caption: this.traducir('frm-venta-detalles.colUndPedidas','Und.Reservadas'),      
      visible: true,
      width: 150,
    },    
    {
      dataField: 'CantidadDisponible',
      caption: this.traducir('frm-venta-detalles.colUndDisponibles','Disponibles'),      
      visible: true,
      width: 150,
    },   
    {
      dataField: 'FechaActualizacion',
      caption: this.traducir('frm-venta-detalles.colAvisos','Fec.Actualización'),
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
      const nav = this.router.getCurrentNavigation().extras.state;      
      if (( nav.Salida !== null) && ( nav.Salida !== undefined)) {
        this._salida= nav.Salida;
      }
    }


  ngOnInit(): void {
    this.cargarCombos();
    setTimeout(() => {this.cargarLineasSalida();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // Totales + redimensionar grid, popUp
    this.dg.mostrarFilaSumaryTotal('IdLinea','IdArticulo',this.traducir('frm-venta-detalles.TotalRegistros','Total Lineas: '),'count');
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
    // foco 
    this.formSalida.instance.getEditor('Contrato').focus();
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
    (await this.planificadorService.getCombos_PantallaSalidas()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposEstadoSalida = datos.datos.ListaEstados;
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-ventas-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-ventas-detalles');
      }
    );
  }  

  async cargarLineasSalida(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getLineasSalida(this._salida.IdSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayLineasSalida = datos.datos;
          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-ventas-detalles.msgError_WSCargarLineas','Error cargando lineas de la Salida')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-ventas-detalles');
      }
    );
  } 

  //#endregion
  
  btnSalir() {
    this.location.back();
  }

  btnCancelar(){
    // recuperar datos entrada previa a cambios
    this._salida = this._salidaCopia
    this.setModoEdicion(false);      
  }

  btnGuardar(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-detalles.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        alert('llamar web-service actualizar datos');
        this.setModoEdicion(false);
      }
    }      
  }

  btnEditarSalida(){
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._salidaCopia = Object.assign({},this._salida);
    // edicion
    this.setModoEdicion(true);   
  }

  btnPlanificarSalida(){
    alert('Función no implementada')
  }

  btnEditarLineaSalida(index:number){    
    alert('pendiente de implementar');
  }

    // validacion estandar del formulario
    validarFormulario():boolean{
      const res = this.formSalida.instance.validate();
      // res.status === "pending" && res.complete.then((r) => {
      //   console.log(r.status);
      // });
      return (res.isValid);
    }
  
    // validacion complementaria datos del formulario
    validarDatosFormulario():boolean{      
      // if ((!Utilidades.isEmpty(this._entrada.Confirmada)) && (this._entrada.FechaConfirmada <= new Date(0))) {
      //   Utilidades.MostrarErrorStr(this.traducir('frm-compra-detalles.msgError_FechaConfirmacionVacia','Debe indicar un valor en el campo Fecha CONFIRMACION'));
      //   return false;
      // }
      return true;
    }

    setModoEdicion(editar:boolean){
      this.modoEdicion = editar;
      this.cols[0].visible = editar;        
      this.dg.DataGrid.instance.option('columns',this.cols);
      setTimeout(() => {
        if (editar) {
            Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer,false);
        }
        else {
            Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer,false);
        }
        }, 100); 
    }


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
