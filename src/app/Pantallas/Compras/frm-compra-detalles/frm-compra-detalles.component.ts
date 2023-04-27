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
import { Entrada, EntradaLinea, EstadoEntrada } from '../../../Clases/Entrada';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-frm-compra-detalles',
  templateUrl: './frm-compra-detalles.component.html',
  styleUrls: ['./frm-compra-detalles.component.css']
})
export class FrmCompraDetallesComponent implements OnInit,AfterViewInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formEntrada', { static: false }) formEntrada: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-compra-detalles.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-compra-detalles.btnEditar', 'Editar'), posicion: 2, accion: () => {this.btnEditarEntrada()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-venta-detalles.btnCancelar', 'Cancelar'), posicion: 3, accion: () => {this.btnCancelarSalida()}, tipo: TipoBoton.success },    
    { icono: '', texto: this.traducir('frm-compra-detalles.btnConfirmar', 'Confirmar'), posicion: 4, accion: () => {this.btnConfirmarEntrada()}, tipo: TipoBoton.success },
  ];
  
  btnAcionesEdicion: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];


  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  _entrada: Entrada = new(Entrada);
  arrayTiposEstadoEntrada: Array<EstadoEntrada> = [];  
  arrayAlmacenes: Array<Almacen> = [];
  requerirFechaConfirmacion:boolean = false;
  
  modoEdicion: boolean = false;
  _entradaCopia: Entrada = new(Entrada);

  // grid lineas Entrada
  // [IdEntrada,  IdLinea, IdArticulo, NombreArticulo, CantidadPedida, CantidadConfirmada, CantidadCancelada, FechaActualizacion ]
  arrayLineasEntrada: Array<EntradaLinea>;
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
            this.btnEditarLineaEntrada(e.row.rowIndex); 
          }
        },
      ]
    },    
    {
      dataField: 'IdEntrada',
      caption: this.traducir('frm-compra-detalles.colIdEntrada','Id.Entrada'),
      visible: false,
    }, 
    {
      dataField: 'IdLinea',
      caption: this.traducir('frm-compra-detalles.colIdLinea','Linea'),
      visible: false,
    },     
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-compra-detalles.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-compra-detalles.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-compra-detalles.colUndPedidas','Und.Pedidas'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'CantidadConfirmada',
      caption: this.traducir('frm-compra-detalles.colUndConfirmadas','Und.Confirmadas'),      
      visible: true,
      width: 150,
    },    
    {
      dataField: 'CantidadCancelada',
      caption: this.traducir('frm-compra-detalles.colUndCanceladas','Und.Canceladas'),      
      visible: true,
      width: 150,
    },   
    {
      dataField: 'FechaActualizacion',
      caption: this.traducir('frm-compra-detalles.colAvisos','Fec.Actualización'),
      visible: false,
    },       
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 100, '', );

  // botones acciones formulario
  confirmarButtonOptions: any;
  cancelarButtonOptions: any;

  //#endregion

  
  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              )  { 
    // obtenemos dato identificacion de envio del routing
    const nav = this.router.getCurrentNavigation().extras.state;      
    if (( nav.Entrada !== null) && ( nav.Entrada !== undefined)) {
      this._entrada= nav.Entrada;
    }

    // botones acciones formulario
    this.confirmarButtonOptions = {
      icon: 'add',
      text: 'Confirmar',
      type: 'success',
      visible: this.modoEdicion,      
      onClick: () => {
        alert('Confirmar');
        // this.employee.Phones.push('');
        // this.phoneOptions = this.getPhonesOptions(this.employee.Phones);
      },
    };     

  }


  ngOnInit(): void {
    this.personalizarBotonesAccion()
    this.cargarCombos();
    setTimeout(() => {this.cargarLineasEntrada();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
    // foco 
    this.formEntrada.instance.getEditor('Contrato').focus();
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
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
    let filtroAlmacen:number= 0; // todos los almacenes activos
    (await this.planificadorService.getCombos_PantallaEntradas(filtroAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposEstadoEntrada = datos.datos.ListaEstados;
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-compras-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-compras-detalles');
      }
    );
  }  

  async cargarLineasEntrada(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getLineasSalida(this._entrada.IdEntrada)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayLineasEntrada = datos.datos;
          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasEntrada, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-compras-detalles.msgError_WSCargarLineas','Error cargando lineas de la Entrada')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-compras-detalles');
      }
    );
  } 

  async ActualizarEntrada(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarEntrada(this._entrada.IdEntrada,this._entrada.Referencia,this._entrada.FechaPrevista,this._entrada.FechaConfirmada,
                                                     this._entrada.IdEstado,this._entrada.NombreProveedor,this._entrada.Observaciones,
                                                     this._entrada.IdAlmacen,this._entrada.Confirmada, this.arrayLineasEntrada)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-compra-detalles.msgOk_WSEntradaActualizada','Contrato Entrada Actualizado'),'success',1000);                     
          //this._salida = datos.datos[0];
          this.personalizarBotonesAccion();
          // this.arrayLineasSalida = datos.datos.lineas;
          // // Se configura el grid
          // this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          // this.dgConfigLineas.actualizarConfig(true,false,'standard');
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-compra-detalles.msgError_WSActualizarEntrada','Error WS Actualizando entrada')); 
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

  btnEditarEntrada(){
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._entradaCopia = Object.assign({},this._entrada);
    // edicion
    this.setModoEdicion(true);    
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
      }, 200); 
  }

  btnCancelar(){
    // recuperar datos entrada previa a cambios
    this._entrada = this._entradaCopia
    this.setModoEdicion(false);      
  }

  btnGuardar(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-compra-detalles.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        this.ActualizarEntrada();
        this.setModoEdicion(false);
      }
    }      
  }

  async btnCancelarSalida(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgCancelar', '¿Esta seguro que desea CANCELAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-compra-detalles.TituloCancelar', 'Cancelar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.IdEstado=99;
      this._entrada.Confirmada=false;
      this.ActualizarEntrada();
    }     
  }

  async btnDesCancelarSalida(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgDesCancelar', '¿Esta seguro que desea ACTIVAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-compra-detalles.TituloDESCancelar', 'DES-Cancelar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.IdEstado=1;
      this.ActualizarEntrada();
    }      
    alert('Función no implementada')
  }

  btnConfirmarEntrada(){
    alert('Función no implementada')
  }

  btnEditarLineaEntrada(index:number){    
    alert('pendiente de implementar');
  }

  // validacion estandar del formulario
  validarFormulario():boolean{
    const res = this.formEntrada.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  // validacion complementaria datos del formulario
  validarDatosFormulario():boolean{
    
    if ((!Utilidades.isEmpty(this._entrada.Confirmada)) && (this._entrada.FechaConfirmada <= new Date(0))) {
      Utilidades.MostrarErrorStr(this.traducir('frm-compra-detalles.msgError_FechaConfirmacionVacia','Debe indicar un valor en el campo Fecha CONFIRMACION'));
      return false;
    }
    return true;
  }

  personalizarBotonesAccion(){
    // personalizacion boton Cancelar/DEScancelar segun valor estado salida mostrada
    if (this._entrada.IdEstado==99) {
      this.btnAciones[2].texto='DES-Cancelar';
      this.btnAciones[2].accion= () => {this.btnDesCancelarSalida()}      
    } else {
      this.btnAciones[2].texto='Cancelar';
      this.btnAciones[2].accion = () => {this.btnCancelarSalida()}
    }

    //TODO - Eliminar
    // // personalizacion boton Planificar/DESplanificar segun valor planificar salida mostrada
    // if (this._entrada.Confirmada) {
    //   this.btnAciones[3].texto='DES-Confirmar';
    //   this.btnAciones[3].accion= () => {this.btnDesPlanificarSalida()}      
    // } else {
    //   this.btnAciones[3].texto='Confirmar';
    //   this.btnAciones[3].accion = () => {this.btnPlanificarSalida()}
    // }    
  }

  setFormFocus(campo:string){
    try {
      const editor = this.formEntrada.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

}

