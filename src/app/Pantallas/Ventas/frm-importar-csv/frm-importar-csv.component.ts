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
import { Salida, SalidaLinea, LineasCSV } from '../../../Clases/Salida'
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxTextBoxComponent, DxPopupComponent } from 'devextreme-angular';
import { locale } from 'devextreme/localization';
import { UtilidadesLayher } from '../../../Utilidades/UtilidadesLayher'

@Component({
  selector: 'app-frm-importar-csv',
  templateUrl: './frm-importar-csv.component.html',
  styleUrls: ['./frm-importar-csv.component.css']
})
export class FrmImportarCsvComponent implements OnInit {

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
  @ViewChild('FicheroCSV') FicheroCSV: any;  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-importar-csv.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-importar-csv.btnLimpiar', 'Limpiar Todo'), posicion: 2, accion: () => {this.limpiarDocumento()}, tipo: TipoBoton.primary },
    { icono: '', texto: this.traducir('frm-importar-csv.btnVerPlanificador', 'Simular Planificación'), posicion: 3, accion: () => {this.btnImportarOferta()}, tipo: TipoBoton.success, activo: false },
  ];
  
  // btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-importar-csv.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarDocumento(), nroFilas:1 };
  // btnIconoBuscar: BotonIcono =  { icono: 'bi bi-search', texto: this.traducir('frm-importar-csv.btnBuscar', 'Buscar'), accion: () => this.btnBuscarDocumento(), nroFilas:1 };

  WSDatos_Validando: boolean = false; 
  aviso :boolean = false;
  
  _salida: Salida = new(Salida);
  arrayAlmacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesActivos;  
  arrayTiposDocumentos: Array<TipoDocumentoImportarCSV> = [];
  //arrayTiposEstadoSalida: Array<EstadoSalida> = [];  
  
  requerirFechaFin:boolean = false;

  // grid lista articulos cargados ERP
  // [IdSalidaERP, Cantidad, Cualidad, IdArticuloERP, IdArticulo, NombreArticulo, Aviso]
  mostrarAvisosLinea: boolean = false;
  arrayLineasSalida: Array<SalidaLinea> = [];
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 95,
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
        { icon: "trash",
          hint: "Eliminar Línea",
          onClick: (e) => { 
            this.btnEliminarLineaSalida(e.row.rowIndex); 
          }
        },        
      ]
    },      
    // {
    //   dataField: 'IdSalidaERP',
    //   caption: this.traducir('frm-importar-csv.colIdSalidaERP','IdSalidaERP'),
    //   visible: false,
    // }, 
    // {
    //   dataField: 'Cualidad',
    //   caption: this.traducir('frm-importar-csv.colCualidad','Cualidad'),
    //   visible: false,
    // },     
    // {
    //   dataField: 'IdArticuloERP',
    //   caption: this.traducir('frm-importar-csv.colIdArticuloERP','IdArticuloERP'),
    //   visible: false,
    // },
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-importar-csv.colIdArticulo','Articulo'),
      visible: true,
      width: 200,
    },            
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-importar-csv.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-importar-csv.colUndPedidas','Cantidad'),      
      visible: true,
      width: 100,
    },
    {
      dataField: 'Aviso',
      caption: this.traducir('frm-importar-csv.colAvisos','Aviso'),
      visible: true, //this.mostrarAvisosLinea,
      width: 250,
    },

    // marca linea con excepciones
    {
      dataField: 'Excepcion',
      caption: this.traducir('frm-importar-csv.colAvisos','Ex.'),
      visible: true, //this.mostrarAvisosLinea,
      width: 50,
    },   
    // {
    //   dataField: '',
    //   caption: '*',
    //   visible: true,
    //   type: "buttons",
    //   width: 40,
    //   alignment: "center",
    //   //fixed: true,
    //   //fixedPosition: "right",
    //   buttons: [ 
    //     { icon: "info",
    //       hint: "Linea con excepcion",
    //       visible: (e) => { (e.row.data.Excepcion || e.row.data.Modificada) }
    //     }
    //   ]
    // },                
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(this.arrayLineasSalida, this.cols, 400, '' );

  //popUp Editar Lineas
  @ViewChild('popUpEditarLinea', { static: false }) popUpEditarLinea: DxPopupComponent;
  popUpVisibleEditarLinea:boolean = false;
  lineaSeleccionada: SalidaLinea = new SalidaLinea();
  lineaSeleccionadaIndex: number = null;

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
              ) 
  { 
    // Asignar localizacion ESPAÑA
    locale('es');
    // Array Tipos Documentos
    this.arrayTiposDocumentos.push({IdTipoDocumento:10,NombreDocumento:'VENTA'});
    this.arrayTiposDocumentos.push({IdTipoDocumento:20,NombreDocumento:'ALQUILER'});
  }

  ngOnInit(): void {
    this.asignarValoresDefecto();
  }


  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // configuracion extra del grid -> mostrar fila total registros + redimensionar
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo',this.traducir('frm-compra-importar.TotalRegistros','Total Líneas: '),'count');    
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
    // foco
    // setTimeout(() => { this.txtContrato.instance.focus(); }, 300);    
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

  async importarOferta(){
    if(this.WSDatos_Validando) return;    
    // if(Utilidades.isEmpty(this.str_txtContrato)) return;
    // if(!this.contratoValido) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.ImportarSimulacionSalidaCSV(this._salida.IdSalidaERP,this._salida.Contrato,this._salida.Referencia,this._salida.IdEstado
                                                  ,this._salida.FechaAlta,this._salida.FechaInicio,this._salida.FechaFin
                                                  ,this._salida.IdCliente,this._salida.IdClienteERP,this._salida.NombreCliente
                                                  ,this._salida.Obra,this._salida.Observaciones,this._salida.IdAlmacen,this._salida.IdTipoDocumento,this._salida.Planificar
                                                  ,this.arrayLineasSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //this._salida = datos.datos[0];
          this._salida.IdSalida = datos.datos[0].IdSalida;
          this._salida.IdSimulacion = datos.datos[0].IdSimulacion;
          //Utilidades.MostrarExitoStr(this.traducir('frm-importar-csv.msgOk_WSImportarEntrada','Documento Importado correctamente'));           

          // ir a pantalla de planificador
          let vSalida : Salida =  this._salida;
          const navigationExtras: NavigationExtras = {
            state: { PantallaAnterior: 'frm-importar-csv', salida: vSalida },
            //replaceUrl: true
          };
          this.router.navigate(['simulador_planificador'], navigationExtras);

          // limpiar datos 
          this.limpiarDocumento();

        } else { 
          if ((datos.datos.lineasError == null) || (datos.datos.lineasError == undefined) || (datos.datos.lineasError.length==0)){
            Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_WSImportarOfertaCSV','Error WS importando simulacion oferta')); 
          } 
          else {
            Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_WSImportarOfertaCSVarticulos','Simulacion Cancelada: Artículos no encontrados (revise CSV)')); 
            this.mostrarAvisosLinea = true;
            this.arrayLineasSalida = datos.datos.lineasError;
            this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
            this.dgConfigLineas.actualizarConfig(true,false,'standard');  
          }        
        }

        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-importar-csv');
      }
    );
  }

  //#endregion

  limpiarDocumento(){
    //limpiamos documento y formulario
    this._salida = new(Salida);
    this.fileReset();
    this.asignarValoresDefecto(true);
  }


  // Asignar valores por defecto para contrato de salida a siumlar -> No tener que introducir todos los datos por el usuario
  asignarValoresDefecto(limpiar=false){
    this._salida.Contrato = this.get_IdContrato_Simulacion();
    this._salida.IdSalida = -1;
    this._salida.IdSalidaERP = -1;
    this._salida.FechaAlta = new Date();  //new Date().toLocaleDateString();
    this._salida.IdEstado = 1; //UtilidadesLayher.salidaEstadoPorDefecto();   
    this._salida.IdCliente = -1;    
    this._salida.IdClienteERP= 'Cliente';
    this._salida.Planificar = UtilidadesLayher.salidaValorPlanificarPorDefecto();
    this._salida.IdTipoDocumento = 20;
    this._salida.IdAlmacen = ConfiGlobal.DatosUsuario.idAlmacenDefecto; 
    
    if (limpiar) {
      // this._salida.IdTipoDocumento = 0;
      // this._salida.IdAlmacen = 0;
      this._salida.NombreCliente= '';
      this._salida.Referencia = '';
      this._salida.Obra = ''  
    }
    else {
      this._salida.NombreCliente= 'CLI_simulación';
      this._salida.Referencia = 'REF_simulación';
      this._salida.Obra = 'OBRA_simulación'
    }

    // enviar foco a primer elemento vacio
    setTimeout(() => {
      if (Utilidades.isEmpty(this._salida.IdTipoDocumento)) this.setFormFocus('IdTipoDocumento');
      else if (Utilidades.isEmpty(this._salida.IdAlmacen)) this.setFormFocus('IdAlmacen');
      else this.setFormFocus('FechaInicio');        
    }, 1000);
  }

  get_IdContrato_Simulacion(): string {
    let date: Date = new Date();    
    let newIdContrato: string = 'SIM_' + ConfiGlobal.DatosUsuario.IdUsuario.toString() + '_' +
                                date.getFullYear().toString() + (date.getMonth()+1).toString() + date.getDate().toString() +
                                date.getHours().toString() + date.getMinutes().toString() + date.getMilliseconds().toString();
    return newIdContrato;
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
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FechaFin','Fecha FIN debe ser mayor que Fecha INICIO. Revise el formulario'));
      return false;
    }
    return true;
  }


  btnImportarOferta() {
    // validacion extandar del formulario con datos requeridos y formatos
    if ((this.arrayLineasSalida == null) || (this.arrayLineasSalida.length == 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FaltanLineasDatos','Lineas de articulos a importar del CSV no cargadas'));
      return;
    }
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FaltanDatos','Faltan datos y/o hay datos incorrectos. Revise el formulario'));
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
    this.lineaSeleccionadaIndex= index; 
    this.lineaSeleccionada = this.arrayLineasSalida[index];         
    this.lineaSeleccionada.Modificada = false;     
    this.popUpVisibleEditarLinea = true;
  }  

  cerrarEditarLinea(e){
    if (e != null) {     
      // Actualizar info del grid          
      if (!Utilidades.isEmpty(e.FechaInicio)) {
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].FechaInicio = e.FechaInicio;
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].Modificada=true;
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].Excepcion=true;
      }
      if (!Utilidades.isEmpty(e.FechaFin)) {
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].FechaFin = e.FechaFin;
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].Modificada=true;
        this.arrayLineasSalida[this.lineaSeleccionadaIndex].Excepcion=true;
      }
    }
    this.lineaSeleccionada = null;
    this.popUpVisibleEditarLinea = false;      
  }

  async btnEliminarLineaSalida(index:number){
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-importar-csv.dlgEliminarLineaMensaje','La línea seleccionada será eliminada y NO IMPORTADA al planificador.<br>¿Seguro que desea continuar?'), 
                                                               this.traducir('frm-importar-csv.dlgEliminarLineaTitulo', 'Eliminar Línea'));
    if (confirmar) {
      this.arrayLineasSalida.splice(index,1);
    }
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


  // ------------------------------------------------------------------------------
  //#region -- IMPORTACION DATOS CSV --
  
  /*
  guardarCsv(file: FileList) {
    this.ficheroCsv = file.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(this.ficheroCsv);    
  }

  cargarDatos() {
    if (this.ficheroCsv == null) {
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FicheroNoSeleccionado','Fichero de carga no seleccionado')); 
    }
    else {
      this.cargarDatosCSV();
    }
  }
  */
  
  leerFicheroCSV_2_Array($event: any):void{
    let text = [];  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);          
        this.arrayLineasSalida = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, 0, headersRow.length);  
        this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
        this.dgConfigLineas.actualizarConfig(true,false,'standard');
      };  
  
      reader.onerror = function () {  
        //console.log('Error durante la lectura del fichero. Compruebe formato adecuado');  
        Utilidades.MostrarErrorStr('Error durante la lectura del fichero. Compruebe formato adecuado');
      };  
  
    } else {  
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_CsvNovalido','Seleccione archivo csv valido'));
      this.fileReset();  
    }  
  }  

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, filaInicio: number, numColumnas: any) {  
    let csvArr = [];   
    try {
      for (let i = filaInicio; i < csvRecordsArray.length; i++) {  
        let curruntRecord = (<string>csvRecordsArray[i]).split(';');  
        if (curruntRecord.length == numColumnas) {  
          let csvRecord: LineasCSV = new LineasCSV();  
          csvRecord.IdArticulo = curruntRecord[0].trim();  
          csvRecord.NombreArticulo = curruntRecord[1].trim();  
          csvRecord.CantidadPedida = parseInt(curruntRecord[2].trim());  
          csvRecord.Procesado = false;
          csvRecord.Error = false;
          csvRecord.Aviso = ''; 
          csvRecord.Modificada = false;
          csvRecord.Excepcion = false;
          if (csvRecord.CantidadPedida>0) {
            csvArr.push(csvRecord);
          }
        }  
      }   
    }
    catch {
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_LecturaCsv','Error cargando datos fichero csv. Revise formato del fichero'));
      let csvArr = [];
    }
    return csvArr;  
  }

  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(';');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  } 

  fileReset() {  
    this.FicheroCSV.nativeElement.value = ""; 
    this.mostrarAvisosLinea = false; 
    this.arrayLineasSalida = [];  
    this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
  }

  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }   

  //#endregion  

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }
    
}

export class TipoDocumentoImportarCSV {
  IdTipoDocumento: number;
  NombreDocumento: string;
}

