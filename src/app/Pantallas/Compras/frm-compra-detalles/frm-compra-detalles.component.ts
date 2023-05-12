import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
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
import { DxPopupComponent } from 'devextreme-angular';

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
    { icono: '', texto: this.traducir('frm-compra-detalles.btnCancelar', 'Marcar Cancelado'), posicion: 3, accion: () => {this.btnCancelarEntrada()}, tipo: TipoBoton.success },    
    { icono: '', texto: this.traducir('frm-compra-detalles.btnConfirmar', 'Confirmar'), posicion: 4, accion: () => {this.btnConfirmarEntrada()}, tipo: TipoBoton.success },
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

  //popUp Editar Lineas
  @ViewChild('popUpEditarLinea', { static: false }) popUpEditarLinea: DxPopupComponent;
  popUpVisibleEditarLinea:boolean = false;
  lineaSeleccionada: EntradaLinea = new EntradaLinea();

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
    (await this.planificadorService.getLineasEntrada(this._entrada.IdEntrada)).subscribe(
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
        Utilidades.compError(error, this.router,'frm-compra-detalles');
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

    // ajuste dinamico de botones acciones segun modo edicion    
    if (editar) {
      this.btnAciones[0].texto = this.traducir('frm-compra-detalles.btnCancelar', 'Cancelar');      
      this.btnAciones[0].accion = () => {this.btnCancelar()};
      this.btnAciones[1].texto = this.traducir('frm-compra-detalles.btnGuardar', 'Guardar');
      this.btnAciones[1].accion = () => {this.btnGuardar()};
      this.btnAciones[1].tipo= TipoBoton.success;
    } else {
      this.btnAciones[0].texto = this.traducir('frm-compra-detalles.btnSalir', 'Salir');
      this.btnAciones[0].accion = () => {this.btnSalir()};
      this.btnAciones[1].texto = this.traducir('frm-compra-detalles.btnEditar', 'Editar');
      this.btnAciones[1].accion = () => {this.btnEditarEntrada()};
      this.btnAciones[1].tipo= TipoBoton.secondary;
      this.personalizarBotonesAccion();
    }
    this.btnAciones[2].visible = !editar;
    this.btnAciones[3].visible = !editar;
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

  async btnCancelarEntrada(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgCancelar', '¿Esta seguro que desea CANCELAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-compra-detalles.TituloCancelar', 'Cancelar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.IdEstado=99;
      this._entrada.Confirmada=false;
      this.ActualizarEntrada();
    }     
  }

  async btnDesCancelarEntrada(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgDesCancelar', '¿Esta seguro que desea ACTIVAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-compra-detalles.TituloDESCancelar', 'DES-Cancelar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.IdEstado=1;
      this.ActualizarEntrada();
    }      
  }

  async btnConfirmarEntrada(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgConfirmar', '¿Esta seguro que desea CONFIRMAR con fecha de hoy el contrato de Entrada seleccionado?'), this.traducir('frm-compra-detalles.TituloConfirmar', 'Confirmar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.Confirmada=true;
      this._entrada.FechaConfirmada= new Date();
      this.ActualizarEntrada();
    }     
  }

  async btnDesConfirmarEntrada(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-detalles.MsgDesConfirmar', '¿Esta seguro que desea DES-Confirmar el contrato de Entrada seleccionado?'), this.traducir('frm-compra-detalles.TituloDESConfirmar', 'DES-Confirmar Entrada'));  
    if (!continuar) return;
    else {
      this._entrada.Confirmada=false;
      this._entrada.FechaConfirmada=null;
      this.ActualizarEntrada();
    }       
  }

  btnEditarLineaEntrada(index:number){    
    //alert('pendiente de implementar');
    this.lineaSeleccionada = this.arrayLineasEntrada[index];
    this.popUpVisibleEditarLinea = true;
  }

  cerrarEditarLinea(e){
    if (e != null) {     
      // Actualizar info del grid    
      alert('actualizar info grid');
      //this.cargarStock(this.sbAlmacenes.SelectBox.value);
    }
    this.popUpVisibleEditarLinea = false;    
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
    // confirmda -> requiere fecha confirmación
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
      this.btnAciones[2].accion= () => {this.btnDesCancelarEntrada()}      
    } else {
      this.btnAciones[2].texto='Marcar Cancelado';
      this.btnAciones[2].accion = () => {this.btnCancelarEntrada()}
    }

    // personalizacion boton Planificar/DESplanificar segun valor planificar salida mostrada
    if (this._entrada.Confirmada) {
      this.btnAciones[3].texto='DES-Confirmar';
      this.btnAciones[3].accion= () => {this.btnDesConfirmarEntrada()}      
    } else {
      this.btnAciones[3].texto='Confirmar';
      this.btnAciones[3].accion = () => {this.btnConfirmarEntrada()}
    }    
  }

  setFormFocus(campo:string){
    try {
      const editor = this.formEntrada.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

}

