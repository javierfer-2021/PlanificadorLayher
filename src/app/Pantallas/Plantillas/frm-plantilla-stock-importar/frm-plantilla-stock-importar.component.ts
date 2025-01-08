import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
//import { Salida, SalidaLinea, LineasCSV} from '../../../Clases/Salida';
import { PlantillaStock, PlantillaStockLinea, LineasCSV } from '../../../Clases/PlantillaStock';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxTextBoxComponent, DxPopupComponent } from 'devextreme-angular';
import { locale } from 'devextreme/localization';
import { UtilidadesLayher } from '../../../Utilidades/UtilidadesLayher'

@Component({
  selector: 'app-frm-plantilla-stock-importar',
  templateUrl: './frm-plantilla-stock-importar.component.html',
  styleUrls: ['./frm-plantilla-stock-importar.component.css']
})
export class FrmPlantillaStockImportarComponent implements OnInit, AfterViewInit, AfterContentChecked {

  @Input() _plantilla: PlantillaStock;                                     // plantilla sobre la que se va a importar
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();     // retorno de la pantalla  

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
    { icono: '', texto: this.traducir('frm-importar-csv.btnImportar', 'Importar Artículos'), posicion: 3, accion: () => {this.btnImportarOferta()}, tipo: TipoBoton.success, activo: false },
  ];
  
  
  WSDatos_Validando: boolean = false; 
  aviso :boolean = false;
  
  _plantillaStock: PlantillaStock = new(PlantillaStock);
  
  // grid lista articulos importados CSV
  mostrarAvisosLinea: boolean = false;
  arrayLineasSalida: Array<PlantillaStockLinea> = [];
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 40,
      alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "trash",
          hint: "Eliminar Línea",
          onClick: (e) => { 
            this.btnEliminarLineaSalida(e.row.rowIndex); 
          }
        },        
      ]
    },      
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
      dataField: 'Excepcion',
      caption: this.traducir('frm-importar-csv.colAvisos','Ex.'),
      visible: true, 
      width: 50,
    },                  
    {
      dataField: 'Aviso',
      caption: this.traducir('frm-importar-csv.colAvisos','Aviso'),
      visible: true, 
      width: 250,
    },
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(this.arrayLineasSalida, this.cols, 400, '' );

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
  }

  ngOnInit(): void {
    this._plantillaStock = Object.assign(this._plantilla);
  }


  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // configuracion extra del grid -> mostrar fila total registros + redimensionar
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo','Total Líneas: ','count');    
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

  // async importarOferta(){
  //   if(this.WSDatos_Validando) return;    
  //   // if(Utilidades.isEmpty(this.str_txtContrato)) return;
  //   // if(!this.contratoValido) return;

  //   this.WSDatos_Validando = true;
  //   (await this.planificadorService.ImportarSimulacionSalidaCSV(this._salida.IdSalidaERP,this._salida.Contrato,this._salida.Referencia,this._salida.IdEstado
  //                                                 ,this._salida.FechaAlta,this._salida.FechaInicio,this._salida.FechaFin
  //                                                 ,this._salida.IdCliente,this._salida.IdClienteERP,this._salida.NombreCliente
  //                                                 ,this._salida.Obra,this._salida.Observaciones,this._salida.IdAlmacen,this._salida.IdTipoDocumento,this._salida.Planificar
  //                                                 ,this.arrayLineasSalida)).subscribe(
  //     datos => {
  //       if(Utilidades.DatosWSCorrectos(datos)) {
  //         //this._salida = datos.datos[0];
  //         this._salida.IdSalida = datos.datos[0].IdSalida;
  //         this._salida.IdSimulacion = datos.datos[0].IdSimulacion;
  //         //Utilidades.MostrarExitoStr(this.traducir('frm-importar-csv.msgOk_WSImportarEntrada','Documento Importado correctamente'));           

  //         // ir a pantalla de planificador
  //         let vSalida : Salida =  this._salida;
  //         const navigationExtras: NavigationExtras = {
  //           state: { PantallaAnterior: 'frm-importar-csv', salida: vSalida },
  //           //replaceUrl: true
  //         };
  //         this.router.navigate(['simulador_planificador'], navigationExtras);

  //         // limpiar datos 
  //         this.limpiarDocumento();

  //       } else { 
  //         if ((datos.datos.lineasError == null) || (datos.datos.lineasError == undefined) || (datos.datos.lineasError.length==0)){
  //           Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_WSImportarOfertaCSV','Error WS importando simulacion oferta')); 
  //         } 
  //         else {
  //           Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_WSImportarOfertaCSVarticulos','Simulacion Cancelada: Artículos no encontrados (revise CSV)')); 
  //           this.mostrarAvisosLinea = true;
  //           this.arrayLineasSalida = datos.datos.lineasError;
  //           this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
  //           this.dgConfigLineas.actualizarConfig(true,false,'standard');  
  //         }        
  //       }

  //       this.WSDatos_Validando = false;
  //     }, error => {
  //       this.WSDatos_Validando = false;
  //       Utilidades.compError(error, this.router,'frm-importar-csv');
  //     }
  //   );
  // }

  async validarCodigosArticulos(){
    if (this.WSDatos_Validando) return; 
    // if ( (this.arrayLineasSalida==null) || (this.arrayLineasSalida==undefined) || (this.arrayLineasSalida.length==0)) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.validarCodigosArticulosCSV(this._salida.IdSalidaERP,this._salida.Contrato,this._salida.Referencia,this._salida.IdEstado
    //                                               ,this._salida.FechaAlta,this._salida.FechaInicio,this._salida.FechaFin
    //                                               ,this._salida.IdCliente,this._salida.IdClienteERP,this._salida.NombreCliente
    //                                               ,this._salida.Obra,this._salida.Observaciones,this._salida.IdAlmacen,this._salida.IdTipoDocumento,this._salida.Planificar
    //                                               ,this.arrayLineasSalida)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.arrayLineasSalida = datos.datos;
    //       this.dgConfigLineas = new DataGridConfig(this.arrayLineasSalida, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       this.dgConfigLineas.actualizarConfig(true,false,'standard');
    //     } else { 
    //         Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_WSComprobarCodigosArticulosCSV','Error WS comprobacion codigos articulos')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-importar-csv');
    //   }
    // );
  }
  
  //#endregion


  limpiarDocumento(){
    //limpiamos documento y formulario
    //this._plantillaStock = new(PlantillaStock);
    this.fileReset();
  }


  validarFormulario():boolean{
    const res = this.formSalida.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  validarDatosFormulario():boolean{
    // if ((!Utilidades.isEmpty(this._salida.FechaFin)) && (this._salida.FechaFin <= this._salida.FechaInicio)) {
    //   Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FechaFin','Fecha FIN debe ser mayor que Fecha INICIO. Revise el formulario'));
    //   return false;
    // }
    return true;
  }

  btnImportarOferta() {
    // validacion extandar del formulario con datos requeridos y formatos
    if ((this.arrayLineasSalida == null) || (this.arrayLineasSalida.length == 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-importar-csv.msgError_FaltanLineasDatos','Lineas de artículos a importar del CSV no cargadas'));
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
        // this.importarOferta();
        alert('servicion de importación');
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


  //----------------------------------------
  //#region - Edicion lineas de importacion

  async btnEliminarLineaSalida(index:number){
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-importar-csv.dlgEliminarLineaMensaje','La línea seleccionada será eliminada y NO IMPORTADA.<br>¿Seguro que desea continuar?'), 
                                                               this.traducir('frm-importar-csv.dlgEliminarLineaTitulo', 'Eliminar Línea'));
    if (confirmar) {
      this.arrayLineasSalida.splice(index,1);
    }
  }  

  //#endregion  


  //----------------------------------------
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
        
        // proceso adicional de validación articulos leidos del fichero
        this.validarCodigosArticulos();
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
          //csvRecord.NombreArticulo = curruntRecord[1].trim();  
          //csvRecord.CantidadPedida = parseInt(curruntRecord[1].trim());  
          csvRecord.Procesado = false;
          csvRecord.Error = false;
          csvRecord.Aviso = ''; 
          //csvRecord.Modificada = false;
          //csvRecord.Excepcion = false;
          // if (csvRecord.CantidadPedida>0) {
          //   csvArr.push(csvRecord);
          // }
          csvArr.push(csvRecord);
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



