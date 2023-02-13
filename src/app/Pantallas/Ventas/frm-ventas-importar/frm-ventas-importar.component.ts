import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/BotonPantalla';
import { BotonIcono } from '../../../Clases/BotonIcono';
import { ColumnDataGrid } from '../../../Clases/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Oferta, OfertaLinea, EstadoOferta, LineasCSV, LineasCSV_Validadas, Almacen} from '../../../Clases/Oferta';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent,DxTextBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-ventas-importar',
  templateUrl: './frm-ventas-importar.component.html',
  styleUrls: ['./frm-ventas-importar.component.css']
})
export class FrmVentasImportarComponent implements OnInit, AfterViewInit, AfterContentChecked {

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
  
  btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle-fill', texto: this.traducir('frm-venta-importar.btnLimpiar', 'Limpiar'), accion: () => this.btnLimpiarDocumento(), nroFilas:1 };
  btnIconoBuscar: BotonIcono =  { icono: 'bi bi-file-earmark-arrow-down-fill', texto: this.traducir('frm-venta-importar.btnBuscar', 'Buscar'), accion: () => this.btnBuscarDocumento(), nroFilas:1 };

  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  documentoValido:boolean = false;
  str_txtDocumento: string = '';
  color_txtDocumento: string = '';
  vCambiado_str_txtDocumento:boolean = false;
  

  _oferta: Oferta = new(Oferta);
  arrayTiposEstadoOferta: Array<EstadoOferta> = [];  
  arrayAlmacenes: Array<Almacen> = [];  

  ficheroCsv: File = null;

  // grid lista articulos cargados csv
  // [IdArticulo, NombreArticulo, Unidades, UnidadesDisponibles, Avisos, Mensaje]
  arrayLineasOferta: Array<LineasCSV_Validadas>;
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
    // Asignar localizacion ESPAÑA
    locale('es');
  }

  ngOnInit(): void {
    this.cargarCombos();
    // asignar valores por defecto
    this._oferta.FechaAlta = new Date().toLocaleDateString();
    this._oferta.IdAlmacen = 1;
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
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
  
  onEnterKey_campo() {}
  
  onValueChanged_campo() {}
  
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
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-importar.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async cargarDatosCSV(){
    //alert('Cargar fichero lineas');
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.ficheroCsv)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.cargarDatosCSV_LineasOferta(this.ficheroCsv,this._oferta.FechaAlta,this._oferta.IdAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          //console.log(datos);
          this.arrayLineasOferta = datos.datos.ArticulosValidados;

          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasOferta, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');

        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-importar.msgError_WSCargarLineas','Error cargando lineas csv')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async importarOferta(){
    //alert('Importar oferta');
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.ficheroCsv)) return;

    this.WSDatos_Validando = true;

    (await this.planificadorService.importarOferta(this._oferta.Referencia,this._oferta.Cliente,this._oferta.Contrato,this._oferta.IdEstado
                                                  ,this._oferta.FechaAlta,this._oferta.FechaInicio,this._oferta.FechaFin
                                                  ,this._oferta.Obra,this._oferta.Observaciones,this._oferta.IdAlmacen,this.arrayLineasOferta)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          console.log(datos);

          Utilidades.MostrarExitoStr(this.traducir('frm-ofertas-importar.msgOk_WSImportarOferta','Oferta Importada correctamente'));           
          // ir a pantalla de planificador
          //alert('ir a pantalla planificador con idoferta'+this._oferta.Referencia);
          
          const navigationExtras: NavigationExtras = {
            state: { PantallaAnterior: 'frm-oferta-buscar', oferta: this._oferta.Referencia },
            replaceUrl: true
          };
          this.router.navigate(['pruebas'], navigationExtras);

          this.limpiarOferta();
        } else {          
          this.WSEnvioCsv_Valido = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-importar.msgError_WSImportarOferta','Error WS importando oferta')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );

  }

  //#endregion

  btnLimpiarDocumento() {
    //limpiamos documento y formulario
    alert('limpiamos documento y formulario');
    this.str_txtDocumento = '';
    this.vCambiado_str_txtDocumento = false;
    this._oferta = null;
    this.arrayLineasOferta = [];
    this.documentoValido = false;
  }

  btnBuscarDocumento() {
    alert('Buscar documento en ERP');
    this.documentoValido = true;
  }

  guardarCsv(file: FileList) {
    this.ficheroCsv = file.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(this.ficheroCsv);
  }

  cargarDatos() {
    if (this.ficheroCsv == null) {
      //alert('Fichero de carga no seleccionado');
      Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-importar.msgError_FicheroNoSeleccionado','Fichero de carga no seleccionado')); 
    }
    else {
      this.cargarDatosCSV();
    }
  }

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

  limpiarOferta(){
    // this._oferta = null;
    // this.arrayLineasOferta = [];
  }

}
