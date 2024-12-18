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
import { PlantillaStock, PlantillaStockLinea } from '../../../Clases/PlantillaStock';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-plantilla-stock',
  templateUrl: './frm-plantilla-stock.component.html',
  styleUrls: ['./frm-plantilla-stock.component.css']
})
export class FrmPlantillaStockComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formPlantilla', { static: false }) formPlantilla: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnEditar', 'Editar Plantilla'), posicion: 2, accion: () => {this.btnEditarEntrada()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnInsertar', 'Nueva Plantilla'), posicion: 3, accion: () => {this.btnCancelarEntrada()}, tipo: TipoBoton.secondary },    
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnConfirmar', 'Eliminar Plantilla'), posicion: 4, accion: () => {this.btnConfirmarEntrada()}, tipo: TipoBoton.secondary },
  ];
  
  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  _plantillaStock: PlantillaStock = new(PlantillaStock);
  arrayAlmacenes: Array<Almacen> = [];
  
  modoEdicion: boolean = false;
  modoInsercion: boolean = false;
  _plantillaStockCopia: PlantillaStock = new(PlantillaStock);

  // grid lineas articulos asociados a la plantilla
  // [IdPlantilla, IdLinea, IdArticulo, NombreArticulo, StockInicial, UnidadesDisponibles]
  arrayLineasPlantilla: Array<PlantillaStockLinea>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: false,
      type: "buttons",
      width: 65,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "edit",
          hint: "Editar Linea",
          visible: false,
          onClick: (e) => { 
            this.btnEditarLineaEntrada(e.row); 
          }
        },
        { icon: "add",
          hint: "Añadir Linea",
          visible: true,
          onClick: (e) => { 
            this.btnEditarLineaEntrada(e.row); 
          }
        },           
        { icon: "trash",
          hint: "Eliminar Linea",
          visible: true,
          onClick: (e) => { 
            this.btnEditarLineaEntrada(e.row); 
          }
        },        
      ]
    },    
    {
      dataField: 'IdPlantilla',
      caption: this.traducir('frm-plantilla-stock.colIdPlantilla','Id.Plantilla'),      
      visible: false,
    }, 
    // {
    //   dataField: 'IdLinea',
    //   caption: this.traducir('frm-plantilla-stock.colIdLinea','Linea'),
    //   visible: false,
    // },     
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-plantilla-stock.colIdArticulo','Articulo'),
      visible: true,
      width: 200,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-plantilla-stock.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'StockInicial',
      caption: this.traducir('frm-plantilla-stock.colStockInicial','Stock Inicial'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'UndDisponibles',
      caption: this.traducir('frm-plantilla-stock.colUndDisponibles','Und.Disponibles'),      
      visible: false,
      width: 150,
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
  lineaSeleccionadaIndex: number = null;

  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;
  popUpTitulo:string = "Selección Articulo";

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
              public planificadorService: PlanificadorService
              )  { 
    // obtenemos dato identificacion de envio del routing
    const nav = this.router.getCurrentNavigation().extras.state;      
    if (( nav.Plantilla !== null) && ( nav.Plantilla !== undefined)) {
      this._plantillaStock = nav.Plantilla;
      this.modoInsercion = (this._plantillaStock.IdPlantilla==-1);
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
    setTimeout(() => {this.cargarLineasPlantilla();},2000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);  
    // control estado botones (llamada en modo insercion)
    this.setModoEdicion(this.modoInsercion);
    // foco 
    this.formPlantilla.instance.getEditor('NombrePlantilla').focus();
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
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSCargarCombos','Error cargando valores Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  }  

  async cargarLineasPlantilla(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getLineasPlantillaStock(this._plantillaStock.IdPlantilla)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayLineasPlantilla = datos.datos;
          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSCargarLineas','Error cargando lineas de la Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  async actualizarPlantilla(){
    if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.actualizarPlantilla(this._plantillaStock.IdEntrada,this._plantillaStock.Referencia,this._plantillaStock.FechaPrevista,this._plantillaStock.FechaConfirmada,
    //                                                  this._plantillaStock.IdEstado,this._plantillaStock.NombreProveedor,this._plantillaStock.Observaciones,
    //                                                  this._plantillaStock.IdAlmacen,this._plantillaStock.Confirmada, this.arrayLineasPlantilla)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSEntradaActualizada','Contrato Entrada Actualizado'),'success',1000);                     
    //       //this._salida = datos.datos[0];
    //       this.personalizarBotonesAccion();
    //       // this.arrayLineasSalida = datos.datos.lineas;
    //       // // Se configura el grid
    //       // this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       // this.dgConfigLineas.actualizarConfig(true,false,'standard');
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSActualizarPlantilla','Error WS Actualizando entrada')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-plantilla-stock');
    //   }
    // );
  } 

  //#endregion

  
  btnSalir() {
    this.location.back();
  }

  btnEditarEntrada(){
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._plantillaStockCopia = Object.assign({},this._plantillaStock);
    // edicion
    this.setModoEdicion(true);    
  }

  setModoEdicion(editar:boolean){
    this.modoEdicion = editar;
    this.cols[0].visible = editar;        
    this.dg.DataGrid.instance.option('columns',this.cols);

    // ajuste dinamico de botones acciones segun modo edicion    
    if (editar) {
      this.btnAciones[0].texto = this.traducir('frm-plantilla-stock.btnCancelar', 'Cancelar');      
      this.btnAciones[0].accion = () => {this.btnCancelar()};
      this.btnAciones[1].texto = this.traducir('frm-plantilla-stock.btnGuardar', 'Guardar');
      this.btnAciones[1].accion = () => {this.btnGuardar()};
      this.btnAciones[1].tipo= TipoBoton.success;
    } else {
      this.btnAciones[0].texto = this.traducir('frm-plantilla-stock.btnSalir', 'Salir');
      this.btnAciones[0].accion = () => {this.btnSalir()};
      this.btnAciones[1].texto = this.traducir('frm-plantilla-stock.btnEditar', 'Editar Plantilla');
      this.btnAciones[1].accion = () => {this.btnEditarEntrada()};
      this.btnAciones[1].tipo= TipoBoton.secondary;
      this.personalizarBotonesAccion();
    }
    this.btnAciones[2].visible = !editar;
    this.btnAciones[3].visible = !editar;
  }

  btnCancelar(){
    // recuperar datos entrada previa a cambios
    this._plantillaStock = this._plantillaStockCopia
    this.setModoEdicion(false);      
  }

  btnGuardar(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        this.actualizarPlantilla();
        this.setModoEdicion(false);
      }
    }      
  }

  async btnCancelarEntrada(){
    // let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgCancelar', '¿Esta seguro que desea CANCELAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-plantilla-stock.TituloCancelar', 'Cancelar Entrada'));  
    // if (!continuar) return;
    // else {
    //   this._plantillaStock.IdEstado=99;
    //   this._plantillaStock.Confirmada=false;
    //   this.ActualizarPlantilla();
    // }     
  }

  async btnDesCancelarEntrada(){
    // let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgDesCancelar', '¿Esta seguro que desea ACTIVAR el contrato de Entrada seleccionado?<br>Aviso: Se realizara re-planificación de las salidas'), this.traducir('frm-plantilla-stock.TituloDESCancelar', 'DES-Cancelar Entrada'));  
    // if (!continuar) return;
    // else {
    //   this._plantillaStock.IdEstado=1;
    //   this.ActualizarPlantilla();
    // }      
  }

  async btnConfirmarEntrada(){
    // let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgConfirmar', '¿Esta seguro que desea CONFIRMAR con fecha de hoy el contrato de Entrada seleccionado?'), this.traducir('frm-plantilla-stock.TituloConfirmar', 'Confirmar Entrada'));  
    // if (!continuar) return;
    // else {
    //   this._plantillaStock.Confirmada=true;
    //   this._plantillaStock.FechaConfirmada= new Date();
    //   this.ActualizarPlantilla();
    // }     
  }

  async btnDesConfirmarEntrada(){
    // let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgDesConfirmar', '¿Esta seguro que desea DES-Confirmar el contrato de Entrada seleccionado?'), this.traducir('frm-plantilla-stock.TituloDESConfirmar', 'DES-Confirmar Entrada'));  
    // if (!continuar) return;
    // else {
    //   this._plantillaStock.Confirmada=false;
    //   this._plantillaStock.FechaConfirmada=null;
    //   this.ActualizarPlantilla();
    // }       
  }

  btnEditarLineaEntrada(data:any){    
    // this.dg.DataGrid.instance.selectRowsByIndexes(data.dataIndex);
    // this.lineaSeleccionada = this.dg.objSeleccionado();
    // this.lineaSeleccionadaIndex = this.arrayLineasPlantilla.findIndex(e => e==this.lineaSeleccionada);
    // //this.lineaSeleccionada.Modificada = false;     
    // this.popUpVisibleEditarLinea = true;    
  }

  cerrarEditarLinea(e){
    // if (e != null) {     
    //   if (this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].CantidadPedida != e.CantidadPedida) {
    //     this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].CantidadPedida = e.CantidadPedida;
    //   } 
    //   if (this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].CantidadCancelada != e.CantidadCancelada) {
    //     this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].CantidadCancelada = e.CantidadCancelada;
    //   }       
    //   this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].Excepcion = ( (!Utilidades.isEmpty(e.FechaPrevista)) || (!Utilidades.isEmpty(e.FechaConfirmada)) );
    //   this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].FechaPrevista = e.FechaPrevista;
    //   this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].FechaConfirmada = e.FechaConfirmada;
    //   this.arrayLineasPlantilla[this.lineaSeleccionadaIndex].Modificada = true;         
    // }
    // this.lineaSeleccionada = null;
    // this.popUpVisibleEditarLinea = false;        
  }
  

  // validacion estandar del formulario
  validarFormulario():boolean{
    const res = this.formPlantilla.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  // validacion complementaria datos del formulario
  validarDatosFormulario():boolean{
    return true;
  }

  personalizarBotonesAccion(){
    // // personalizacion boton Cancelar/DEScancelar segun valor estado salida mostrada
    // if (this._plantillaStock.IdEstado==99) {
    //   this.btnAciones[2].texto='DES-Cancelar';
    //   this.btnAciones[2].accion= () => {this.btnDesCancelarEntrada()}      
    // } else {
    //   this.btnAciones[2].texto='Marcar Cancelado';
    //   this.btnAciones[2].accion = () => {this.btnCancelarEntrada()}
    // }

    // // personalizacion boton Planificar/DESplanificar segun valor planificar salida mostrada
    // if (this._plantillaStock.Confirmada) {
    //   this.btnAciones[3].texto='DES-Confirmar';
    //   this.btnAciones[3].accion= () => {this.btnDesConfirmarEntrada()}      
    // } else {
    //   this.btnAciones[3].texto='Confirmar';
    //   this.btnAciones[3].accion = () => {this.btnConfirmarEntrada()}
    // }    
  }

  setFormFocus(campo:string){
    try {
      const editor = this.formPlantilla.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }


  btnBuscarArticulo(){
    this.popUpVisibleArticulos = true;
  }

  cerrarSeleccionarArticulo(e){    
    if (e != null) {
      alert(e.IdArticulo+' - '+e.NombreArticulo);
      // this.IdArticulo = e.IdArticulo;
      // this.str_txtArticulo = e.NombreArticulo;
    }
    this.popUpVisibleArticulos = false;
  }

  btnImportarCsv(){}

  btnInsertarLinea(){}

}

