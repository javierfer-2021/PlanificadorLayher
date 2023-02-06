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
import { Oferta, OfertaLinea, EstadoOferta, LineasCSV, Almacen} from '../../Clases/Oferta';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent,DxTextBoxComponent, DxPopupComponent, DxTextAreaModule, DxSelectBoxComponent } from 'devextreme-angular';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
  
  @ViewChild('formOferta', { static: false }) formOferta: DxFormComponent;

  // @ViewChild('txtReferencia', { static: false }) txtReferencia: DxTextBoxComponent;
  // @ViewChild('txtCliente', { static: false }) txtCliente: DxTextBoxComponent;
  // @ViewChild('comboEstadoOferta', { static: false }) comboEstadoOferta: DxSelectBoxComponent;
  // @ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  // @ViewChild('txtObra', { static: false }) txtObra: DxTextBoxComponent;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-oferta-importar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-oferta-importar.btnImportar', 'Importar'), posicion: 2, accion: () => {this.salir()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  _oferta: Oferta = new(Oferta);
  arrayTiposEstadoOferta: Array<EstadoOferta> = [];  
  arrayAlmacenes: Array<Almacen> = [];  

  ficheroCsv: File = null;

  // str_txtReferencia: string = '';
  // str_txtCliente: string = '';
  // str_txtEstado: string = '';
  // str_txtContrato: string = '';

  // grid lista articulos cargados csv
  // [IdArticulo, NombreArticulo, Unidades, Mensaje]
  arrayLineasOferta: Array<LineasCSV>;
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
    //cargar combos almacenes y estados ofertas
    let _almacen = new(Almacen)
    _almacen.IdAlmacen=1;
    _almacen.NombreAlmacen='MADRID';
    this.arrayAlmacenes.push(_almacen);

    this.arrayTiposEstadoOferta.push({IdEstado:0,NombreEstado:'PROPUESTA'});
    this.arrayTiposEstadoOferta.push({IdEstado:1,NombreEstado:'CONFIRMADA'});
    // asignar valores por defecto
    this._oferta.FechaAlta = new Date().toLocaleDateString();
    this._oferta.IdAlmacen = 1;
  }

  ngOnInit(): void {
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

  //#region -- WEB_SERVICES
  async cargarDatosCSV(){
    //alert('Cargar fichero lineas');
    if(this.WSDatos_Validando) return;
    if(Utilidades.isEmpty(this.ficheroCsv)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.cargarDatosCSV_LineasOferta(this.ficheroCsv)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          console.log(datos);

          this.arrayLineasOferta = datos.datos.Articulos;

          // Se configura el grid
          this.dgConfigLineas = new DataGridConfig(this.arrayLineasOferta, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigLineas.actualizarConfig(true,false,'standard');

        } else {
          this.WSEnvioCsv_Valido = false;
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async importarOferta(){

  }

  //#endregion

  guardarCsv(file: FileList) {
    this.ficheroCsv = file.item(0);
    const reader = new FileReader();
    reader.readAsDataURL(this.ficheroCsv);
  }

  cargarDatos() {
    if (this.ficheroCsv == null) {
      alert('Fichero de carga no seleccionado')
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

  ImportarOfera() {
    // guardamos info del usuario modificada - insertada
    if (!this.validarDatosFormulario()) return;
    else {
      // llamar a web_service de importacion
    }
  }
    
  salir() {
    this.location.back();
  }


}
