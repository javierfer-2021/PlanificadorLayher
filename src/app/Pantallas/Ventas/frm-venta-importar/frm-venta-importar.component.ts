import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
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
import { Oferta, LineaOferta_ERP, EstadoOferta, Almacen} from '../../../Clases/Oferta';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent,DxTextBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-venta-importar',
  templateUrl: './frm-venta-importar.component.html',
  styleUrls: ['./frm-venta-importar.component.css']
})
export class FrmVentaImportarComponent implements OnInit, AfterViewInit, AfterContentChecked {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('txtDocumento', { static: false }) txtDocumento: DxTextBoxComponent;
  @ViewChild('formOferta', { static: false }) formOferta: DxFormComponent;  
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-importar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-importar.btnImportar', 'Importar'), posicion: 2, accion: () => {this.btnImportarOferta()}, tipo: TipoBoton.success },
  ];
  
  btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-venta-importar.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarDocumento(), nroFilas:1 };
  btnIconoBuscar: BotonIcono =  { icono: 'bi bi-search', texto: this.traducir('frm-venta-importar.btnBuscar', 'Buscar'), accion: () => this.btnBuscarDocumento(), nroFilas:1 };

  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  documentoValido:boolean = true;
  str_txtDocumento: string = '';
  color_txtDocumento: string = '';
  vCambiado_str_txtDocumento:boolean = false;
  
  aviso :boolean = true;
  str_txtTipoDocumento:string ='<Tipo Documento>';
  
  _oferta: Oferta = new(Oferta);
  arrayTiposEstadoOferta: Array<EstadoOferta> = [];  
  arrayAlmacenes: Array<Almacen> = [];  

  // grid lista articulos cargados csv
  // [IdArticulo, NombreArticulo, Unidades, UnidadesDisponibles, Avisos, Mensaje]
  arrayLineasOferta: Array<LineaOferta_ERP>;
  cols: Array<ColumnDataGrid> = [
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
      dataField: 'Unidades',
      caption: this.traducir('frm-venta-importar.colUndPedidas','Unidades'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'UnidadesDisponibles',
      caption: this.traducir('frm-venta-importar.colUndDisponibles','Disponibles'),      
      visible: true,
      width: 150,
    },   
    {
      dataField: 'Avisos',
      caption: this.traducir('frm-venta-importar.colAvisos','Avisos'),
      visible: false,
    },       
    {
      dataField: 'Mensaje',
      caption: this.traducir('frm-venta-importar.colMensaje','Mensaje'),
      visible: true,      
    },
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 400, '', );

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
    //TODO -Eliminar
    // asignar valores por defecto
    // this._oferta.FechaAlta = new Date().toLocaleDateString();
    // this._oferta.IdAlmacen = 1;
  }


  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
      this.documentoValido=false;
      this.aviso=false;
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


  //#region -- Gestion eventos 
  
  onEnterKey_campo() {
    this.btnBuscarDocumento();
  }
  
  onValueChanged_campo() {
    this.vCambiado_str_txtDocumento = true;
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
          this._oferta.IdAlmacen = 1;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async obtenerDatosVentaERP(){
    //alert('Cargar fichero lineas');
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.str_txtDocumento)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.cargarVenta_from_ERP(this.str_txtDocumento)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Datos cabecera          
          this._oferta = datos.datos.Cabecera[0];
          this.color_txtDocumento = ConfiGlobal.colorValido;
          this.documentoValido = true;
          this.aviso = (this._oferta.Aviso != '');
          
          //Datos Linea
          this.arrayLineasOferta = datos.datos.Lineas;
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasOferta, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');

        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSobtenerDatosVentaERP','Error: Documento no encontrado')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSobtenerDatosVentaERP','Error WebService --> Obtener datos ERP')); 
        console.log(error);
      }
    );
  }  

  async importarOferta(){
    //alert('Importar oferta');
    if(this.WSDatos_Validando) return;    
    if(Utilidades.isEmpty(this.str_txtDocumento)) return;
    if(!this.documentoValido) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.importarOferta(this._oferta.Referencia,this._oferta.Cliente,this._oferta.Contrato,this._oferta.IdEstado
                                                  ,this._oferta.FechaAlta,this._oferta.FechaInicio,this._oferta.FechaFin
                                                  ,this._oferta.Obra,this._oferta.Observaciones,this._oferta.IdAlmacen,this.arrayLineasOferta)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          console.log(datos);

          Utilidades.MostrarExitoStr(this.traducir('frm-venta-importar.msgOk_WSImportarOferta','Oferta Importada correctamente'));           

          // ir a pantalla de planificador
          const navigationExtras: NavigationExtras = {
            state: { PantallaAnterior: 'frm-oferta-buscar', oferta: this._oferta.Referencia },
            replaceUrl: true
          };
          this.router.navigate(['pruebas'], navigationExtras);

          this.limpiarDocumento();
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.msgError_WSImportarOferta','Error WS importando oferta')); 
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
    if (this.documentoValido) {
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
    if (Utilidades.isEmpty(this.str_txtDocumento)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-importar.ErrorDocumentoVacio','Debe indicar un numero de documento a buscar'),'error'); 
      this.txtDocumento.instance.focus();
    } else {
      this.obtenerDatosVentaERP();
    }
  }

  limpiarDocumento(){
    //limpiamos documento y formulario
    this.str_txtDocumento = '';
    this.color_txtDocumento = '';
    this.vCambiado_str_txtDocumento = false;
    this._oferta = null;
    this.arrayLineasOferta = [];
    this.documentoValido = false;
    this.txtDocumento.instance.focus();
  }


  //TODO --> Eliminar
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

  validarDatosFormulario():boolean{
    const res = this.formOferta.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  btnImportarOferta() {
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
