import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { BotonIcono } from '../../../Clases/Componentes/BotonIcono';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Entrada,EntradaLinea,EstadoEntrada } from '../../../Clases/Entrada';
import { Almacen} from '../../../Clases/Articulo';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxTextBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-compra-importar',
  templateUrl: './frm-compra-importar.component.html',
  styleUrls: ['./frm-compra-importar.component.css']
})
export class FrmCompraImportarComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  @ViewChild('formEntrada', { static: false }) formEntrada: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-compra-importar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-compra-importar.btnImportar', 'Importar'), posicion: 2, accion: () => {this.btnImportarEntrada()}, tipo: TipoBoton.success },
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

  _entrada: Entrada = new(Entrada);
  arrayTiposEstadoEntrada: Array<EstadoEntrada> = [];  
  arrayAlmacenes: Array<Almacen> = [];  
  requerirFechaConfirmacion:boolean = false;

  // grid lista articulos cargados ERP
  // [IdEntradaERP, Cantidad, Cualidad, IdArticuloERP, IdArticulo, NombreArticulo, Aviso]
  arrayLineasEntrada: Array<EntradaLinea>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: 'IdEntradaERP',
      caption: this.traducir('frm-compra-importar.colIdEntradaERP','IdEntradaERP'),
      visible: false,
    }, 
    {
      dataField: 'Cualidad',
      caption: this.traducir('frm-compra-importar.colCualidad','Cualidad'),
      visible: false,
    },     
    {
      dataField: 'IdArticuloERP',
      caption: this.traducir('frm-compra-importar.colIdArticuloERP','IdArticuloERP'),
      visible: false,
    },
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-compra-importar.colIdArticulo','Articulo'),
      visible: true,
    },            
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-compra-importar.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'Cantidad',
      caption: this.traducir('frm-compra-importar.colUndPedidas','Cantidad'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'Aviso',
      caption: this.traducir('frm-compra-importar.colAvisos','Aviso'),
      visible: false,
    },       
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 300, '', );

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
    
    // foco 
    // try {this.formEntrada.instance.getEditor('IdEstado').focus(); } catch {}

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

    this.WSDatos_Validando = true;
    (await this.planificadorService.getCombos_PantallaSalidas()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposEstadoEntrada = datos.datos.ListaEstados;
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
          this._entrada.IdAlmacen = 1;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-importar.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async obtenerDatosCompraERP(){
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.str_txtContrato)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.cargarEntrada_from_ERP(this.str_txtContrato)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Datos cabecera          
          this._entrada = datos.datos.Cabecera[0];          
          this.contratoValido = true;
          this.color_txtContrato = ConfiGlobal.colorValido;          
          this.str_txtTipoDocumento = this._entrada.NombreTipoDocumento;
          this.aviso = (this._entrada.Aviso != '');
          this.requerirFechaConfirmacion = false;  //(this._entrada.IdTipoDocumento == 20);
                    
          //Datos Linea
          this.arrayLineasEntrada = datos.datos.Lineas;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasEntrada, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');
          
          this.asignarValoresDefecto();
        } else {          
          //this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-compra-importar.msgError_WSobtenerDatosERP','Error: Documento no encontrado')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.MostrarErrorStr(this.traducir('frm-compra-importar.msgError_WSobtenerDatosERP','Error WebService --> Obtener datos ERP')); 
        console.log(error);
      }
    );
  }  

  async importarOferta(){
    if(this.WSDatos_Validando) return;    
    if(Utilidades.isEmpty(this.str_txtContrato)) return;
    if(!this.contratoValido) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.importarEntrada(this._entrada.IdEntradaERP,this._entrada.Contrato,this._entrada.Referencia,this._entrada.IdEstado
                                                  ,this._entrada.FechaAlta,this._entrada.FechaPrevista,this._entrada.FechaConfirmada
                                                  ,this._entrada.IdProveedor,this._entrada.IdProveedorERP,this._entrada.NombreProveedor
                                                  ,this._entrada.Observaciones,this._entrada.IdAlmacen,this._entrada.IdTipoDocumento,this._entrada.Confirmada
                                                  ,this.arrayLineasEntrada)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //this.WSEnvioCsv_Valido = true;
          console.log(datos);

          Utilidades.MostrarExitoStr(this.traducir('frm-compra-importar.msgOk_WSImportarCompra','Documento Importado correctamente'));           

          // ir a pantalla de planificador
          // const navigationExtras: NavigationExtras = {
          //   state: { PantallaAnterior: 'frm-oferta-buscar', oferta: this._entrada.Referencia },
          //   replaceUrl: true
          // };
          // this.router.navigate(['pruebas'], navigationExtras);
          this.limpiarDocumento();
        } else {          
          //this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-compra-importar.msgError_WSImportarCompra','Error WS importando documento')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );

  }

  //#endregion

  async btnLimpiarDocumento() {
    if (this.contratoValido) {
      let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-compra-importar.dlgLimpiarDocumentoMensaje','El documento no ha sido importado.<br>¿Seguro que desea limpiar el documento seleccionado?'), this.traducir('frm-venta-importar.dlgLimpiarDocumentoTitulo', 'Limpiar Documento'));
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
      this.obtenerDatosCompraERP();
    }
  }

  limpiarDocumento(){
    //limpiamos documento y formulario
    this.str_txtContrato = '';
    this.color_txtContrato = '';
    this.vCambiado_str_txtContrato = false;
    this._entrada = null;
    this.arrayLineasEntrada = [];
    this.contratoValido = false;
    this.txtContrato.instance.focus();
  }

  asignarValoresDefecto(){
    this._entrada.FechaAlta = new Date() //new Date().toLocaleDateString();
    this._entrada.IdEstado = 1;
    this._entrada.IdAlmacen = ConfiGlobal.DatosUsuario.idAlmacenDefecto;
    this._entrada.Confirmada = false;
    //Foco
    //try {this.formEntrada.instance.getEditor('IdEstado').focus();} catch { }
  }


  validarDatosFormulario():boolean{
    const res = this.formEntrada.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  btnImportarEntrada() {
    // guardamos info del usuario modificada - insertada
    if (!this.validarDatosFormulario()) return;
    else {
      // llamar a web_service de importacion
      this.importarOferta();
    }
  }
    
  btnSalir() {
    this.location.back();
  }

}

