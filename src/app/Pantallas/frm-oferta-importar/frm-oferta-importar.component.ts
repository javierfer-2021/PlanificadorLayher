import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/BotonPantalla';
import { ColumnDataGrid } from '../../Clases/ColumnDataGrid';
import { DataGridConfig } from '../../Clases/DataGridConfig';
import { Utilidades } from '../../Utilidades/Utilidades';
import { Oferta, OfertaLinea, EstadoOferta, LineasCSV} from '../../Clases/Oferta';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { DxTextBoxComponent, DxPopupComponent, DxTextAreaModule, DxSelectBoxComponent } from 'devextreme-angular';


@Component({
  selector: 'app-frm-oferta-importar',
  templateUrl: './frm-oferta-importar.component.html',
  styleUrls: ['./frm-oferta-importar.component.css']
})
export class FrmOfertaImportarComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('txtReferencia', { static: false }) txtReferencia: DxTextBoxComponent;
  @ViewChild('txtCliente', { static: false }) txtCliente: DxTextBoxComponent;
  @ViewChild('comboEstadoOferta', { static: false }) comboEstadoOferta: DxSelectBoxComponent;
  @ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  @ViewChild('txtObra', { static: false }) txtObra: DxTextBoxComponent;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-oferta-importar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-oferta-importar.btnImportar', 'Importar'), posicion: 2, accion: () => {this.salir()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;

  _oferta: Oferta = new(Oferta);
  arrayTiposEstadoOferta: Array<EstadoOferta> = [];  

  str_txtReferencia: string = '';
  str_txtCliente: string = '';
  str_txtEstado: string = '';
  str_txtContrato: string = '';

  // grid lista articulos cargados csv
  // [IdArticulo, NombreArticulo, Unidades, Mensaje]
  arrayOfertas: Array<LineasCSV>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: 'IdArticulo',
      caption: this.traducir('frm-oferta-importar.colIdArticulo','Articulo'),
      visible: true,
    },      
    {
      dataField: 'NombreArticulo',
      caption: this.traducir('frm-oferta-importar.colNombreArticulo','Descripción'),
      visible: true,
    },    
    {
      dataField: 'Unidades',
      caption: this.traducir('frm-oferta-importar.colUnidades','Unidades'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'Mensaje',
      caption: this.traducir('frm-oferta-importar.colMensaje','Mensaje'),
      visible: true,      
    },
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '', );

  //#endregion

  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              ) { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);    
    // foco 
    this.txtReferencia.instance.focus();    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
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
  async cargarDatos(){
    alert('Cargar fichero lineas');
    // if(this.WSEnvioCsv_Validando) return;
    // if(Utilidades.isEmpty(this.ficheroCsv)) return;

    // this.limpiarControles();

    // this.WSEnvioCsv_Validando = true;
    // (await this.planificadorService.cargarDatos(this.ficheroCsv)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.WSEnvioCsv_Valido = true;
    //       console.log(datos);

    //       this.arrayArts = datos.datos.Articulos;

    //       this.arrayUnidadesMostrar = new Array<oUnidMostrar>();
    //       this.arrayArts.forEach(element => {
    //         let unidMostrar: oUnidMostrar = new oUnidMostrar();
    //         unidMostrar.UnidadesMostrar = element.UnidadesMostrar;
    //         this.arrayUnidadesMostrar.push(unidMostrar);
    //       });

    //       // Se configura el grid
    //       this.dgConfigArticulos = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       this.dgConfigArticulos.actualizarConfig(true,false,'standard');

    //       // Se configura el grid 2
    //       let newCol: ColumnDataGrid = {
    //         dataField: 'PROD. MULTIPLE',
    //         caption: 'PROD. MULTIPLE',
    //         cssClass: 'grisClaro',
    //         columns: [{
    //           dataField: '001/AP22040061',
    //           caption: '001/AP22040061',
    //           cssClass: 'gris',
    //           columns: [{
    //             dataField: '',
    //             caption: '',
    //             cssClass: 'blanco',
    //             columns: [{
    //               dataField: '',
    //               caption: '',
    //               cssClass: 'blanco',
    //               columns: [{
    //                 dataField: '26/04/2022',
    //                 caption: '26/04/2022',
    //                 cssClass: 'fecha',
    //                 columns: [{
    //                   dataField: '22/05/2022',
    //                   caption: '22/05/2022',
    //                   cssClass: 'fechaRoja',
    //                   columns: [{
    //                     dataField: 'UnidadesMostrar',
    //                     caption: 'Unidades',
    //                     cssClass: 'gris',
    //                     allowSorting: false
    //                   }]
    //                 }]
    //               }]
    //             }]
    //           }]
    //         }]
    //       }

    //       this.colsUnidades.push(newCol);
    //       this.dgConfigUnidades = new DataGridConfig(this.arrayUnidadesMostrar, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       this.dgConfigUnidades.actualizarConfig(true,false,'standard');
    //     } else {
    //       this.WSEnvioCsv_Valido = false;
    //     }
    //     this.WSEnvioCsv_Validando = false;
    //   }, error => {
    //     this.WSEnvioCsv_Validando = false;
    //     console.log(error);
    //   }
    // );
  }  
  //#endregion


  salir() {
    this.location.back();
  }


}
