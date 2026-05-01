import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-mostrar-calculo-stock',
  templateUrl: './frm-mostrar-calculo-stock.component.html',
  styleUrls: ['./frm-mostrar-calculo-stock.component.css']
})
export class FrmMostrarCalculoStockComponent implements OnInit {

  @Input() _salida:number;
  @Input() _articulo:string;
  @Input() _simulacion:boolean;
  @Input() _titulo:string;
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-mostrar-calculo-stock.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];

  WSDatos_Validando: boolean = false;
  _totalStock: number = 0;

  // grid lista datos obtenidos
  arrayDatos: Array<any>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: 'ID',
      caption: this.traducir('frm-mostrar-calculo-stock.colIdUsuario','#'),
      visible: false,      
    },      
    {
      dataField: 'TIPO_MOVIMIENTO',
      caption: this.traducir('frm-mostrar-calculo-stock.colNombre','Tipo Movimiento'),
      visible: true,
      width: 120,
    },    
    {
      dataField: 'DESCRIPCION',
      caption: this.traducir('frm-mostrar-calculo-stock.colLogin','Descripción'),
      visible: true,      
    },
    {
      dataField: 'FECHA',
      caption: this.traducir('frm-mostrar-calculo-stock.colPassword','Fecha'),
      visible: true,
      dataType: 'date',
      width: 140,
    },
    {
      dataField: 'UNIDADES',
      caption: this.traducir('frm-mostrar-calculo-stock.colIdIdioma','Und. Mov.'),
      visible: true, 
      width: 100,     
    },
    {
      dataField: 'STOCK',
      caption: this.traducir('frm-mostrar-calculo-stock.colNombreIdioma','Stock'),
      visible: false,
      width: 100,     
    },
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 300, '' );

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
    this.cargarTablaCalculoStock();
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    //this.dg.mostrarFilaSumaryTotal('IdUsuario','Nombre',this.traducir('frm-mostrar-calculo-stock.TotalRegistros','Total Usuarios: '),'count');

    // redimensionar grid, popUp
    setTimeout(() => {
      //this.dg.panelBusqueda(true);
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
    if (traduccion !== key) { return traduccion; } 
    else { return def; }
  }

  //#endregion


  //#region -- web_services

  async cargarTablaCalculoStock(){
    if (this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getTablaCalculoStockDisponible(this._salida,this._articulo,this._simulacion)).subscribe(
      (datos) => 
      {
        if (Utilidades.DatosWSCorrectos(datos)) 
        {
          // asignar valores devuletos
          this.arrayDatos = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayDatos, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfig.actualizarConfig(true,false, 'standard',true, false);
          this.calcularTotalStockDisponible();
        }
        else 
        {
          Utilidades.MostrarErrorStr(this.traducir('frm-mostrar-calculo-stock.msgErrorWS_CargarTablaCalculoStock','Error web-service obtener datos calculo stock')); 
        }
      this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-mostrar-calculo-stock');
      }
    );
  }

  //#endregion 


  //#region -- botones de opciones principales

  salir() {
    //this.location.back();
    this.cerrarPopUp.emit(null);
  }


  //#endregion

  calcularTotalStockDisponible(){
    this._totalStock = 0;
    this.arrayDatos.forEach(element => { this._totalStock += element.UNIDADES; } );
  }


}
