import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Oferta} from '../../../Clases/Oferta';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-oferta-buscar',
  templateUrl: './frm-oferta-buscar.component.html',
  styleUrls: ['./frm-oferta-buscar.component.css']
})
export class FrmOfertaBuscarComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-oferta-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-oferta-buscar.btnDetalles', 'Ver Detalles'), posicion: 2, accion: () => {this.verDetallesOferta()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-oferta-buscar.btnPlanificador', 'Ver Planificador'), posicion: 3, accion: () => {this.verPlanificador()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-oferta-buscar.btnImportar', 'Importar'), posicion: 4, accion: () => {this.verPantallaImportar()}, tipo: TipoBoton.secondary },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista ofertas
  // [IdOferta, Referencia, Cliente, Contrato, IdEstado, Estado, FechaAlta, FechaInicio, FechaFin, Obra, Observaciones, IdAlmacen, Almacen, NumLineas]
  arrayOfertas: Array<Oferta>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: false,
      type: "buttons",
      width: 40,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "info",
          hint: "Ver direccion entrega",
          onClick: (e) => { 
            this.btnMostrarOferta(e.row.rowIndex); 
          }
        },
      ]
    },
    {
      dataField: 'IdOferta',
      caption: this.traducir('frm-oferta-buscar.colOferta','Oferta'),
      visible: false,
    },      
    {
      dataField: 'Referencia',
      caption: this.traducir('frm-oferta-buscar.colReferencia','Referencia'),
      visible: true,
      //width: 150,
    },    
    {
      dataField: 'Cliente',
      caption: this.traducir('frm-oferta-buscar.colCliente','Cliente'),      
      visible: true,
    },
    {
      dataField: 'Contrato',
      caption: this.traducir('frm-oferta-buscar.colContrato','Contrato'),
      visible: true,      
    },
    {
      dataField: 'IdEstado',
      caption: this.traducir('frm-oferta-buscar.colIdEstado','IdEstado'),
      visible: false,
    },
    {
      dataField: 'Estado',
      caption: this.traducir('frm-oferta-buscar.colEstado','Estado'),
      visible: true,
    },
    {
      dataField: 'FechaAlta',
      caption: this.traducir('frm-oferta-buscar.colFechaAlta','Fecha Alta'),
      visible: false,
      dataType: 'date',
    },
    {
      dataField: 'FechaInicio',
      caption: this.traducir('frm-oferta-buscar.colFechaInicio','Fecha Inicio'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'FechaFin',
      caption: this.traducir('frm-oferta-buscar.colFechaFin','Fecha Fin'),
      visible: true,
      dataType: 'date',
    },
    {
      dataField: 'Obra',
      caption: this.traducir('frm-oferta-buscar.colObra','Obra'),
      visible: true,
    },
    {
      dataField: 'Observaciones',
      caption: this.traducir('frm-oferta-buscar.colObservaciones','Observaciones'),
      visible: false,
    },
    {
      dataField: 'IdAlmacen',
      caption: this.traducir('frm-oferta-buscar.colIdAlmacen','IdAlmacen'),
      visible: false,
    },
    {
      dataField: 'Almacen',
      caption: this.traducir('frm-oferta-buscar.colAlmacen','Almacen'),
      visible: false,
    },   
    {
      dataField: 'NumLineas',
      caption: this.traducir('frm-oferta-buscar.colNumLineas','Num.Lineas'),
      visible: true,
    },                
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );

  selectedRowsData = [];

  //#endregion

  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { 
    // Asignar localizacion ESPAÑA
    locale('es');
  }

  ngOnInit(): void {
    this.cargarOfertas();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('Referencia','Referencia',this.traducir('frm-oferta-buscar.TotalRegistros','Total Ofertas: '),'count');

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.panelBusqueda(true);
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);
    // foco
    this.dg.DataGrid.instance.focus();    
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


  //#region -- web_services
  
  async cargarOfertas(){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getOfertas()).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this.arrayOfertas = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayOfertas, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayOfertas.length>0) { this.dgConfig.actualizarConfig(true,false, 'standard',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-ofertas-buscar.msgErrorWS_CargarOfertas','Error web-service obtener ofertas')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-ofertas-buscar');
      }
    );
  }

  // prueba obtener datos planificador
  //TODO - ELIMINAR
  /*
  async prueba_obtenerDatosPlanificador(oferta: string){
    //alert('Cargar fichero lineas');
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getPlanificacion(oferta)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          console.log(datos);
        } else {
          alert('Error procedimiento almacenado')
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  
  */

  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  verDetallesOferta(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-oferta-buscar.msgErrorSelectLinea','Debe seleccionar una oferta'));
      return;
    }
    let vOferta : Oferta =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-oferta-buscar', oferta: vOferta }
    };
    this.router.navigate(['detalles_oferta'], navigationExtras);

  }

  verPlanificador(){
    // comprobar registro seleecionado
    this.selectedRowsData = this.dg.DataGrid.instance.getSelectedRowsData();
    if ((this.selectedRowsData === null) || (this.selectedRowsData.length === 0)) {
      Utilidades.MostrarErrorStr(this.traducir('frm-oferta-buscar.msgErrorSelectLinea','Debe seleccionar una oferta'));
      this.dg.DataGrid.instance.focus(); 
      return;
    } 
    else {
      let vOferta : Oferta =  this.dg.objSeleccionado();    
      const navigationExtras: NavigationExtras = {
        state: { PantallaAnterior: 'frm-oferta-buscar', oferta: vOferta.Referencia }
      };
      this.router.navigate(['pruebas'], navigationExtras);
    }

  }

  verPantallaImportar() {
    this.router.navigate(['importar_oferta']);
  }

  //#endregion

  onDoubleClick_DataGrid(){
    this.verPlanificador();
  }

  btnMostrarOferta(index:number){
    // ICONO DEL GRID. oculto no implementado -> se usa boton Ver Detalles Oefrta
  }


}
