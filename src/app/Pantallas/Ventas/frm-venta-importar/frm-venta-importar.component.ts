import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { BotonIcono } from '../../../Clases/Componentes/BotonIcono';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Almacen } from '../../../Clases/Maestros'
import { Salida, EstadoSalida, SalidaLinea } from '../../../Clases/Salida'
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxTextBoxComponent, DxPopupComponent } from 'devextreme-angular';
import { locale } from 'devextreme/localization';
import { UtilidadesLayher } from '../../../Utilidades/UtilidadesLayher'

@Component({
  selector: 'app-frm-venta-importar',
  templateUrl: './frm-venta-importar.component.html',
  styleUrls: ['./frm-venta-importar.component.css']
})
export class FrmVentaImportarComponent implements OnInit, AfterViewInit, AfterContentChecked {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  loadingVisible = false;
  indicatorUrl = "";
  loadingMessage = 'Cargando...'    
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  @ViewChild('formSalida', { static: false }) formSalida: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-importar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-importar.btnImportar', 'Importar'), posicion: 2, accion: () => {this.btnImportarOferta()}, tipo: TipoBoton.success },
  ];
  
  btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-venta-importar.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarDocumento(), nroFilas:1 };
  btnIconoBuscar: BotonIcono =  { icono: 'bi bi-search', texto: this.traducir('frm-venta-importar.btnBuscar', 'Buscar'), accion: () => this.btnBuscarDocumento(), nroFilas:1 };

  WSDatos_Validando: boolean = false;

  str_txtContrato: string = '';
  color_txtContrato: string = '';
  contratoValido:boolean = false;
  vCambiado_str_txtContrato:boolean = false;
  
  aviso :boolean = false;
  str_txtTipoDocumento:string ='<Tipo Documento>';
  
  _salida: Salida = new(Salida);
  arrayTiposEstadoSalida: Array<EstadoSalida> = [];  
  arrayAlmacenes: Array<Almacen> = [];  
  requerirFechaFin:boolean = false;

  // grid lista articulos cargados ERP
  // [IdSalidaERP, Cantidad, Cualidad, IdArticuloERP, IdArticulo, NombreArticulo, Aviso]
  arrayLineasSalida: Array<SalidaLinea>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
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
      dataField: 'IdSalidaERP',
      caption: this.traducir('frm-venta-importar.colIdSalidaERP','IdSalidaERP'),
      visible: false,
    }, 
    {
      dataField: 'Cualidad',
      caption: this.traducir('frm-venta-importar.colCualidad','Cualidad'),
      visible: false,
    },     
    {
      dataField: 'IdArticuloERP',
      caption: this.traducir('frm-venta-importar.colIdArticuloERP','IdArticuloERP'),
      visible: false,
    },
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-venta-importar.colIdArticulo','Articulo'),
      visible: true,
    },            
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-venta-importar.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-venta-importar.colUndPedidas','Cantidad'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'Aviso',
      caption: this.traducir('frm-venta-importar.colAvisos','Aviso'),
      visible: false,
    },       
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 400, '' );

  //popUp Editar Lineas
  @ViewChild('popUpEditarLinea', { static: false }) popUpEditarLinea: DxPopupComponent;
  popUpVisibleEditarLinea:boolean = false;
  lineaSeleccionada: SalidaLinea = new SalidaLinea();

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
    // Asignar localizacion ESPAÑA
    locale('es');
  }

  ngOnInit(): void {
    this.cargarCombos();
    this.contratoValido= true;
  }


  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros + redimensionar
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo',this.traducir('frm-compra-importar.TotalRegistros','Total Líneas: '),'count');    
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
      this.contratoValido= false;      
    }, 200);    

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


  //#region -- Gestion eventos 
  
  onEnterKey_campo() {
    this.btnBuscarDocumento();
  }
  
  onValueChanged_campo() {
    this.vCambiado_str_txtContrato = true;
  }
  
  //#endregion


  //#region -- WEB_SERVICES

  async cargarCombos(){
    if(this.WSDatos_Validando) return;
    let filtroAlmacen:number= 2; // solo almacenes asociados al usuario 
    this.WSDatos_Validando = true;
    (await this.planificadorService.getCombos_PantallaSalidas(filtroAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposEstadoSalida = datos.datos.ListaEstados;
          this.arrayTiposEstadoSalida.pop();  //eliminamos la opcion de estado CANCELADO
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-venta-importar');
      }
    );
  }  

  async obtenerDatosVentaERP(){
    //alert('Cargar fichero lineas');
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.str_txtContrato)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.cargarSalida_from_ERP(this.str_txtContrato)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Datos cabecera          
          this._salida = datos.datos.Cabecera[0];          
          this.contratoValido = true;
          this.color_txtContrato = ConfiGlobal.colorValido;          
          this.str_txtTipoDocumento = this._salida.NombreTipoDocumento;
          this.aviso = (this._salida.Aviso != '');
          this.requerirFechaFin = (this._salida.IdTipoDocumento == 20);
          
          //Datos Linea
          this.arrayLineasSalida = datos.datos.Lineas;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
          
          // Valores por defecto
          this.asignarValoresDefecto();

        } else {          
          //this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSobtenerDatosERP','Error: Documento no encontrado')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-venta-importar');
      }
    );
  }  

  async importarOferta(){
    if(this.WSDatos_Validando) return;    
    if(Utilidades.isEmpty(this.str_txtContrato)) return;
    if(!this.contratoValido) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.importarSalida(this._salida.IdSalidaERP,this._salida.Contrato,this._salida.Referencia,this._salida.IdEstado
                                                  ,this._salida.FechaAlta,this._salida.FechaInicio,this._salida.FechaFin
                                                  ,this._salida.IdCliente,this._salida.IdClienteERP,this._salida.NombreCliente
                                                  ,this._salida.Obra,this._salida.Observaciones,this._salida.IdAlmacen,this._salida.IdTipoDocumento,this._salida.Planificar
                                                  ,this.arrayLineasSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this._salida = datos.datos[0];
          Utilidades.MostrarExitoStr(this.traducir('frm-venta-importar.msgOk_WSImportarEntrada','Documento Importado correctamente'));           

          // ir a pantalla de planificador
          let vSalida : Salida =  this._salida;
          const navigationExtras: NavigationExtras = {
            state: { PantallaAnterior: 'frm-venta-importar', salida: vSalida },
            replaceUrl: true
          };
          this.router.navigate(['planificador'], navigationExtras);

          // limpiar datos 
          this.limpiarDocumento();

        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSImportarOferta','Error WS importando oferta')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-venta-importar');
      }
    );
  }

  //#endregion

  async btnLimpiarDocumento() {
    if (this.contratoValido) {
      let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-venta-importar.dlgLimpiarDocumentoMensaje','El documento no ha sido importado.<br>¿Seguro que desea limpiar el documento seleccionado?'), this.traducir('frm-venta-importar.dlgLimpiarDocumentoTitulo', 'Limpiar Documento'));
      if (confirmar) {
        this.limpiarDocumento();  
      } 
    }
    else {
      this.limpiarDocumento();
    }
  }

  async btnBuscarDocumento() {
    if (Utilidades.isEmpty(this.str_txtContrato)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.ErrorDocumentoVacio','Debe indicar un numero de documento a buscar'),'error'); 
      this.txtContrato.instance.focus();
    } else {
      this.obtenerDatosVentaERP();
    }
  }

  limpiarDocumento(){
    //limpiamos documento y formulario
    this.str_txtContrato = '';
    this.color_txtContrato = '';
    this.vCambiado_str_txtContrato = false;
    this._salida = null;
    this.arrayLineasSalida = [];
    this.contratoValido = false;
    this.txtContrato.instance.focus();
  }

  //TODO - Asignar valores segun configuracion
  asignarValoresDefecto(){
    this._salida.FechaAlta = new Date();  //new Date().toLocaleDateString();
    this._salida.IdEstado = UtilidadesLayher.salidaEstadoPorDefecto();   
    this._salida.Planificar = UtilidadesLayher.salidaValorPlanificarPorDefecto();

    let almacenDef = UtilidadesLayher.salidaAlmacenPorDefecto(this._salida.Contrato);
    if (almacenDef != null) {
      if (this.arrayAlmacenes.findIndex(e => (e.IdAlmacen === almacenDef)) === -1) {
        Utilidades.ShowDialogAviso(this.traducir('frm-venta-importar.MsgErrorAlmacenDef','Almacen por defecto NO valido y/o no disponible para el usuario'));
      } else {
        this._salida.IdAlmacen = almacenDef;
      }
    }
    // enviar foco a primer elemento vacio
    setTimeout(() => {
      if (Utilidades.isEmpty(this._salida.IdEstado)) this.setFormFocus('IdEstado');
      else if (Utilidades.isEmpty(this._salida.Referencia)) this.setFormFocus('Referencia');
      else if (Utilidades.isEmpty(this._salida.Obra)) this.setFormFocus('Obra');
      else if (Utilidades.isEmpty(this._salida.IdAlmacen)) this.setFormFocus('IdAlmacen');
      else this.setFormFocus('FechaInicio');        
    }, 1000);
  }

  validarFormulario():boolean{
    const res = this.formSalida.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  validarDatosFormulario():boolean{
    if ((!Utilidades.isEmpty(this._salida.FechaFin)) && (this._salida.FechaFin <= this._salida.FechaInicio)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_FechaFin','Fecha FIN debe ser mayor que Fecha INICIO. Revise el formulario'));
      return false;
    }
    return true;
  }

  btnImportarOferta() {
    // validacion extandar del formulario con datos requeridos y formatos
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_FaltanDatos','Faltan datos y/o hay datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        // llamar a web_service de importacion
        this.importarOferta();
      }
    }
  }
    

  btnSalir() {
    this.location.back();
  }

  
  formReady(){
    //alert('form listo');
  }

  setFormFocus(campo:string){
    try {
      const editor = this.formSalida.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  //#region - Edicion lineas de importacion
  
  btnEditarLineaSalida(index:number){    
    alert('pendiente de implementar');
    // trasformar entradaLineaERP -> EntradaLinea
    // this.lineaSeleccionada = this.arrayLineasEntrada[index];    
    // this.popUpVisibleEditarLinea = true;
  }  

  cerrarEditarLinea(e){
    if (e != null) {     
      // Actualizar info del grid    
      alert('actualizar info grid');
      //this.cargarStock(this.sbAlmacenes.SelectBox.value);
    }
    this.popUpVisibleEditarLinea = false;    
  }

  //#endregion  

  //#region -- gestion loadPanel

  async mostrarPanelProceso (mensaje?:string) {
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      this.loadingMessage = mensaje;
    }
    this.loadingVisible = true;
  }

  async ocultarPanelProceso () {
    this.indicatorUrl = "";
    this.loadingVisible = false;
  }

  async ocultarPanelProceso_Exito (mensaje?:string) {
    this.indicatorUrl = "../../assets/gifs/checkBackground.gif";
    await Utilidades.delay(1000);
    this.loadingVisible = false;
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarExitoStr(mensaje,'success',3000);
    }
  }

  async ocultarPanelProceso_Fallo (mensaje?:string) {
    this.indicatorUrl = "";
    this.loadingVisible = false;
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarErrorStr(mensaje);
    }    
  }  

  //#endregion
    
}


//#region -- CODIGO EJEMPLO IMPORTACION CSV --
  
  // guardarCsv(file: FileList) {
  //   this.ficheroCsv = file.item(0);
  //   const reader = new FileReader();
  //   reader.readAsDataURL(this.ficheroCsv);
  // }

  // cargarDatos() {
  //   if (this.ficheroCsv == null) {
  //     //alert('Fichero de carga no seleccionado');
  //     Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_FicheroNoSeleccionado','Fichero de carga no seleccionado')); 
  //   }
  //   else {
  //     this.cargarDatosCSV();
  //   }
  // }

//#endregion