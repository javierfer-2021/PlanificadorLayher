import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2,Input,Output,EventEmitter } from '@angular/core';
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
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxPopupComponent } from 'devextreme-angular';
import { locale } from 'devextreme/localization';
import { EntradaLinea } from 'src/app/Clases/Entrada';

@Component({
  selector: 'app-frm-compra-importar-eliminar-lineas',
  templateUrl: './frm-compra-importar-eliminar-lineas.component.html',
  styleUrls: ['./frm-compra-importar-eliminar-lineas.component.css']
})
export class FrmCompraImportarEliminarLineasComponent implements OnInit {

  @Input() _Arraylineas: Array<EntradaLinea>;                               // Array lineas 
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla  

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
  
  //@ViewChild('txtContrato', { static: false }) txtContrato: DxTextBoxComponent;
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-importar.btnSalir', 'Salir/Cancelar'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-importar.btnConfirmar', 'Confirmar'), posicion: 2, accion: () => {this.btnConfirmar()}, tipo: TipoBoton.success },
  ];
  
  btnIconoLimpiar: BotonIcono =  { icono: 'bi bi-x-circle', texto: this.traducir('frm-venta-importar.btnEliminar', 'Eliminar lineas Seleccionadas'), accion: () => this.btnEliminarLineasSeleccionadas(), nroFilas:1 };
    
  // grid lista articulos cargados ERP
  // [IdSalidaERP, Cantidad, Cualidad, IdArticuloERP, IdArticulo, NombreArticulo, Aviso]
  arrayLineas: Array<EntradaLinea>;
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
      dataField: 'CantidadPedida',
      caption: this.traducir('frm-compra-importar.colUndPedidas','Cantidad'),      
      visible: true,
      width: 150,
    },
    {
      dataField: 'FechaPrevista',
      caption: this.traducir('frm-compra-importar.colUndPedidas','Fecha Prevista'),      
      visible: true,
      dataType: 'date', 
      alignment: 'center',
      width: 130,
    },    
    {
      dataField: 'Aviso',
      caption: this.traducir('frm-compra-importar.colAvisos','Aviso'),
      visible: false,
    },
    {
      dataField: 'Modificada',
      caption: this.traducir('frm-compra-importar.colModificada','Mod.'),
      dataType: 'boolean',
      visible: false,
      width: 50,
    }, 
    // marca linea con excepciones
    {
      dataField: 'Excepcion',
      caption: this.traducir('frm-compra-importar.colExcepcion','Exc.'),
      visible: true,
      dataType: 'boolean', 
      width: 50,
    },         
  ];
  dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 400, '' );

  //popUp Buscar Articulo en lineas salida
  @ViewChild('popUpBuscarArticulos', { static: false }) popUpBuscarArticulos: DxPopupComponent;
  popUpVisibleBuscarArticulo:boolean = false;
    
  //menus asociado al grid articulos a importar
  itemsMenuArticulos: any;  

  lineasEliminadas: boolean = false;

  //#endregion  

  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    public translate: TranslateService,
    public planificadorService: PlanificadorService
    )  { 
      // Asignar localizacion ESPAÑA
      locale('es');
      // menu grid lineas articulos
      this.itemsMenuArticulos= [{ text: 'Buscar Refernecia ...' }];   

    }

  ngOnInit(): void { 
    // asignar lineas pasadas como parametro
    this.arrayLineas = this._Arraylineas;    
    this.dgConfigLineas = new DataGridConfig(this.arrayLineas, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigLineas.actualizarConfig(true,false,'standard'); 
    this.dgConfigLineas.modoSeleccion = 'multiple'; 
  }

  ngAfterViewInit(): void {    
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // configuracion extra del grid -> mostrar fila total registros + redimensionar
    this.dg.mostrarFilaSumaryTotal('IdArticulo','IdArticulo',this.traducir('frm-compra-importar-eliminar-linea.TotalRegistros','Total Líneas: '),'count');    
    setTimeout(() => {
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    }, 200);    
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


  btnSalir() {
    this.cerrarPopUp.emit(null);  
  }

  btnConfirmar(){
    if (this.lineasEliminadas) { this.cerrarPopUp.emit(this._Arraylineas); }
    else  { 
      Utilidades.MostrarErrorStr('No se han eliminados lineas que confirmar');
      //this.cerrarPopUp.emit(null); 
    }
  }

  btnEliminarLineasSeleccionadas(){
    let lineasSeleccionadas = this.dg.DataGrid.instance.getSelectedRowsData();
    if (lineasSeleccionadas.length>0){      
      let index:number=-1;
      this.lineasEliminadas = true;
      for (const item of lineasSeleccionadas) {
         index = this._Arraylineas.findIndex(e => e==item);
         if (index!=-1) {  this._Arraylineas.splice(index, 1); }
      }
      Utilidades.MostrarExitoStr('Lineas Eliminadas');  
    }
    else {
      Utilidades.MostrarErrorStr('No hay lineas seleccionadas');
    }
  }

  //#region -- menu lineas articulos a importar
  async itemMenuArticulosClick(e) {
    switch (e.itemIndex) {     
      case 0: 
        //alert('Buscar articulo');
        this.abrirBuscarLineaArticulo();
      break;
      default: break;
    }
  }

  abrirBuscarLineaArticulo(){
    this.popUpVisibleBuscarArticulo = true;
  }

  cerrarBuscarLineaArticulo(CodArticulo){
    if (CodArticulo!=null) {
      this.buscarYSeleccionar(CodArticulo)
    }
    this.popUpVisibleBuscarArticulo = false;
  }

  buscarYSeleccionar(valor: any) {
    const grid = this.dg.DataGrid.instance;
  
    /* busqueda por campo clave */
    // const dataSource = grid.getDataSource();
    // const items = dataSource.items();
  
    // const fila = items.find(x => x.IdArticulo === valor);
  
    // if (fila) {
    //   grid.selectRows([fila.IdArticulo], false); // id = keyExpr
    //   grid.navigateToRow(fila.IdArticulo);
    // } else {
    //   Utilidades.ShowDialogError('Codigo Artículo No Encontrado');
    // }

    /* busqueda por indice | - fiable pero no esta definido keyExpr="id" en el dx-data-grid */
    const items = grid.getDataSource().items();  
    const index = items.findIndex(x => x.IdArticulo === valor);
  
    if (index !== -1) {
      grid.selectRowsByIndexes([index]);
      grid.option("focusedRowIndex", index);
    } else {
      Utilidades.ShowDialogError('Codigo Artículo No Encontrado');
    }
  }

  //#endregion

}
