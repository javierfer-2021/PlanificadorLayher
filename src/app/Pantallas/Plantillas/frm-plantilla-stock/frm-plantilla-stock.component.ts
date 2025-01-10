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
import { LineaCSV, PlantillaStock, PlantillaStockLinea } from '../../../Clases/PlantillaStock';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';
import { DxPopupComponent } from 'devextreme-angular';
import { utils } from 'protractor';

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
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnEditar', 'Editar Plantilla'), posicion: 2, accion: () => {this.btnEditarPlantilla()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnInsertar', 'Nueva Plantilla'), posicion: 3, accion: () => {this.btnInsertarPlantilla()}, tipo: TipoBoton.secondary },    
    { icono: '', texto: this.traducir('frm-plantilla-stock.btnConfirmar', 'Eliminar Plantilla'), posicion: 4, accion: () => {this.btnEliminarPlantilla()}, tipo: TipoBoton.secondary },
  ];
  
  WSDatos_Validando: boolean = false;
  //WSEnvioCsv_Valido: boolean = false;

  _plantillaStock: PlantillaStock = new(PlantillaStock);
  arrayAlmacenes: Array<Almacen> = [];
  
  modoEdicion: boolean = false;
  modoInsercion: boolean = false;
  _plantillaStockCopia: PlantillaStock = new(PlantillaStock);

  // grid lineas articulos asociados a la plantilla
  // [IdPlantilla, IdLinea, IdArticulo, NombreArticulo, StockInicial, UnidadesDisponibles]
  arrayLineasPlantilla: Array<PlantillaStockLinea> = [];
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 65,
      alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "add",
          hint: "Añadir Linea",
          visible: true,
          onClick: (e) => { 
            this.btnInsertarLineaPlantilla(e.row); 
          }
        },           
        { icon: "trash",
          hint: "Eliminar Linea",
          visible: true,
          onClick: (e) => { 
            this.btnEliminarLineaPlantilla(e.row); 
          }
        },        
      ]
    },    
    {
      dataField: 'IdPlantilla',
      caption: this.traducir('frm-plantilla-stock.colIdPlantilla','Id.Plantilla'),      
      visible: false,
    },     
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

  //gestion lineas del grid LineasPlantillaStock
  lineaSeleccionada: PlantillaStockLinea = new PlantillaStockLinea();
  lineaSeleccionadaIndex: number = null;

  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;
  popUpTitulo:string = "Selección Articulo";

  //popUp Importar CSV 
  @ViewChild('popUpImportarCSV', { static: false }) popUpImportarCSV: DxPopupComponent;
  popUpVisibleImportarCSV:boolean = false;

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
  }

  cargarDatosPantalla(){
    this.cargarCombos();
    // if (!this.modoInsercion) {
    //   setTimeout(() => {this.cargarLineasPlantilla();},1500);
    // }    
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);  
    // control estado botones (llamada en modo insercion)
    this.setModoEdicion(this.modoInsercion);    
    // carga datos
    this.cargarDatosPantalla();
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
          // carga secuencial de lineas asociadas a Plantilla en caso no Inserción
          this.WSDatos_Validando = false;
          if (!this.modoInsercion) { this.cargarLineasPlantilla(); }           
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
          //this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSCargarLineas','Error cargando lineas de la Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  async insertarPlantilla(){
    if(this.WSDatos_Validando) return;
    
    // asociamos a la plantilla las lineas insertadas
    this._plantillaStock.Lineas = this.arrayLineasPlantilla;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarPlantillaStock(this._plantillaStock)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSInsertarPlantilla','Plantilla Consulta Stock Insertada'),'success',1000);                     
          // datos plantilla insertada
          this._plantillaStock = datos.datos.Cabecera[0];          
          // lineas Plantilla
          this.arrayLineasPlantilla = datos.datos.Lineas;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);
          // ajuste interfaz
          this.setModoEdicion(false);
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSInsertarPlantilla','Error WS Insertando Plantilla')); 
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

    // asociamos a la plantilla las lineas insertadas
    // this._plantillaStock.Lineas = this.arrayLineasPlantilla;    

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarPlantillaStock(this._plantillaStock)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSActualizarPlantilla','Plantilla Consulta Stock Actualizada'),'success',1000);                     
          // datos plantilla actualizada
          this._plantillaStock = datos.datos.Cabecera[0];          
          // lineas Plantilla
          this.arrayLineasPlantilla = datos.datos.Lineas;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);
          // ajuste interfaz
          this.setModoEdicion(false);
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSActualizarPlantilla','Error WS Actualizando Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  async eliminarPlantilla(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.eliminarPlantillaStock(this._plantillaStock.IdPlantilla)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSEliminarPlantilla','Plantilla Consulta Stock Eliminada'),'success',1000);                     
          // datos plantilla eliminada
          this._plantillaStock = null;
          this.arrayLineasPlantilla = [];
          // salir
          this.btnSalir();
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSEliminarPlantilla','Error WS Eliminar Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  async insertarLineaPlantilla(lineaPlantilla){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarLineaPlantillaStock(lineaPlantilla)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSDatos_Validando = false;
          // Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSInsertarLineaPlantilla','Linea Plantilla Consulta Stock Insertada'),'success',1000);                     
          // insertada en BD=OK -> añadimos al array interfaz
          if (datos.datos[0].Result==0) { this.arrayLineasPlantilla.push(lineaPlantilla); }
          else { Utilidades.MostrarErrorStr(datos.datos[0].Mensaje); }          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSInsertarLineaPlantilla','Error WS Insertar Linea Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  async eliminarLineaPlantilla(lineaPlantilla){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.eliminarLineaPlantillaStock(lineaPlantilla)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          // Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSEliminarLineaPlantilla','Linea Plantilla Consulta Stock Eliminada'),'success',1000);                     
          // eliminada en BD=OK -> eliminamos del array interfaz
          this.arrayLineasPlantilla.splice(this.lineaSeleccionadaIndex,1);
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSEliminarLineaPlantilla','Error WS Eliminar Linea Plantilla')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 


  async importarLineasCSV(lineas){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.PLT_STK_importarArticulosCSV(lineas,this._plantillaStock.IdPlantilla)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-plantilla-stock.msgOk_WSImportarLineasCSV','Lineas ficher CSV Importadas Correctamente'),'success',1000);                     
          this.arrayLineasPlantilla = datos.datos;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-plantilla-stock.msgError_WSImportarLineasCSV','Error WS Importar CSV')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-plantilla-stock');
      }
    );
  } 

  //#endregion


  //#region -- botones acciones principales 
  
  btnSalir() {
    this.location.back();
  }
  
  btnCancelar(){
    if (this.modoInsercion) {
      this.btnSalir();
    } else {
      // recuperar datos entrada previa a cambios
      this._plantillaStock = this._plantillaStockCopia
      this.setModoEdicion(false);      
    }
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
        if (this.modoInsercion) { this.insertarPlantilla(); } 
        else { this.actualizarPlantilla();}
        //this.setModoEdicion(false);
      }
    }      
  }

  btnEditarPlantilla(){
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._plantillaStockCopia = Object.assign({},this._plantillaStock);
    // interfaz modo edicion
    this.setModoEdicion(true);    
  }

  btnInsertarPlantilla(){
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._plantillaStockCopia = Object.assign({},this._plantillaStock);
    // nuevo registro    
    this.modoInsercion = true;
    this._plantillaStock.IdPlantilla = -1;
    this._plantillaStock.IdAlmacen = -1;
    this._plantillaStock.Fecha = new Date();
    this._plantillaStock.NombrePlantilla = '';
    this._plantillaStock.Descripcion = '';
    // nueva lista lineas
    this.arrayLineasPlantilla=[];
    this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);     
    // interfaz modo edicion
    this.setModoEdicion(true);
    // foco
    this.setFormFocus('NombrePlantilla');
  }

  async btnEliminarPlantilla(){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgEliminarConfirmar', '¿Esta seguro que desea Eliminar la Plantilla Seleccionada?'), this.traducir('frm-plantilla-stock.TituloEliminar', 'Eliminar Plantilla'));  
    if (!continuar) return;
    else {
      this.eliminarPlantilla();
    }       
  }
  
  //#endregion -- botones acciones principales 



  //#region -- gestion lineas grid

  btnInsertarLineaPlantilla(data:any){    
    this.btnInsertarLinea();
  }

  async btnEliminarLineaPlantilla(data:any){  
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-plantilla-stock.MsgEliminarLineaConfirmar', '¿Esta seguro que desea Eliminar la Linea Seleccionada?'), this.traducir('frm-plantilla-stock.TituloEliminarLinea', 'Eliminar Linea Plantilla'));  
    if (!continuar) return;
    else {
      this.dg.DataGrid.instance.selectRowsByIndexes(data.dataIndex);
      this.lineaSeleccionada = this.dg.objSeleccionado();
      this.lineaSeleccionadaIndex = this.arrayLineasPlantilla.findIndex(e => e==this.lineaSeleccionada);
      if (this.modoInsercion) {
        this.arrayLineasPlantilla.splice(this.lineaSeleccionadaIndex,1);
      } else {
        this.eliminarLineaPlantilla(this.lineaSeleccionada);
      }
    }
  }

  //#endregion -- gestion lineas grid  


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

  setFormFocus(campo:string){
    try {
      const editor = this.formPlantilla.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  setModoEdicion(editar:boolean){
    this.modoEdicion = editar;
    // this.cols[0].visible = editar;        
    // this.dg.DataGrid.instance.option('columns',this.cols);

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
      this.btnAciones[1].accion = () => {this.btnEditarPlantilla()};
      this.btnAciones[1].tipo= TipoBoton.secondary;
    }
    this.btnAciones[2].visible = !editar;
    this.btnAciones[3].visible = !editar;
  }


  btnInsertarLinea(){
    this.btnBuscarArticulo();
  }

  btnBuscarArticulo(){
    this.popUpVisibleArticulos = true;
  }

  cerrarSeleccionarArticulo(e){    
    this.popUpVisibleArticulos = false;
    if (e != null) {
      let linea = new PlantillaStockLinea();
      linea.IdPlantilla = this._plantillaStock.IdPlantilla;
      linea.IdArticulo = e.IdArticulo;
      linea.NombreArticulo = e.NombreArticulo;
      linea.StockInicial = e.Unidades;
      // check articulo ya incluido en las lineas
      if (this.existeArticuloEnLineas(linea.IdArticulo)) {
        Utilidades.MostrarErrorStr('Articulo ya incluido en las Lineas de la Plantilla');
      } else {
        // insertar linea (insert=array.add vs Edit)
        if (this.modoInsercion) {
          this.arrayLineasPlantilla.push(linea);
        } else {
          this.insertarLineaPlantilla(linea);
        }
      }
    }
  }

  btnImportarCsv(){
    this.popUpVisibleImportarCSV = true;
  }

  cerrarImportarCSV(e){    
    this.popUpVisibleImportarCSV = false;
    // e= lista de articulos importados del CSV
    if (e != null) {
      //this.importarListaCSV_1(e);
      this.importarListaCSV_2(e);
    }    
  }

  // importa linea a linea mediante el WS standar de insertarLineaPlantilla
  importarListaCSV_1(lineasCSV){
      // procesar lista
      for (let i=0; i<lineasCSV.length; i++) {
        if ((!lineasCSV[i].Error) && (!this.existeArticuloEnLineas(lineasCSV[i].IdArticulo))) {
          // nueva linea Plantilla
          let linea = new PlantillaStockLinea();
          linea.IdPlantilla = this._plantillaStock.IdPlantilla;
          linea.IdArticulo = lineasCSV[i].IdArticulo;
          linea.NombreArticulo = lineasCSV[i].NombreArticulo;
          linea.StockInicial = lineasCSV[i].StockInicial;          
          // insertar linea (insert=array.add vs Edit)
          if (this.modoInsercion) {
            this.arrayLineasPlantilla.push(linea);
          } else {
            setTimeout(() => { this.insertarLineaPlantilla(linea); }, 300); 
          }          
        }
      }
  }


  // importa toda la lista a traves de WS
  importarListaCSV_2(lineasCSV){
    let listaImportar:Array<LineaCSV> = [];
    // procesar lista
    for (let i=0; i<lineasCSV.length; i++) {
      if ((!lineasCSV[i].Error) && (!this.existeArticuloEnLineas(lineasCSV[i].IdArticulo))) {
        // nueva linea Plantilla
        let linea = new PlantillaStockLinea();
        linea.IdPlantilla = this._plantillaStock.IdPlantilla;
        linea.IdArticulo = lineasCSV[i].IdArticulo;
        linea.NombreArticulo = lineasCSV[i].NombreArticulo;
        linea.StockInicial = lineasCSV[i].StockInicial;          
        // insertar linea (insert=array.add vs Edit)
        if (this.modoInsercion) {
          this.arrayLineasPlantilla.push(linea);
        } else {
          listaImportar.push(lineasCSV[i]);
        }          
      }
    }
    // importar Lista
    if (!this.modoInsercion) { 
      this.importarLineasCSV(listaImportar);
    } else {
      this.dgConfigLineas = new DataGridConfig(this.arrayLineasPlantilla, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
      this.dgConfigLineas.actualizarConfig(true,false,'standard',true,true);      
    }
  }

  existeArticuloEnLineas(idArticulo:string):boolean {
    if (Utilidades.isEmpty(this.arrayLineasPlantilla)) return false;
    else {
      let index:number = this.arrayLineasPlantilla.findIndex(e => e.IdArticulo==idArticulo);
      return (index>=0);  
    }
  }

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }
  

}

