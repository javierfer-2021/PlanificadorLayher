import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from '../../../Componentes/cmp-data-grid/cmp-data-grid.component';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { DxPopupComponent } from 'devextreme-angular';
import { Salida, SalidaLinea } from '../../../Clases/Salida';
import { ArticuloStock } from '../../../Clases/Maestros';

@Component({
  selector: 'app-frm-planificador-articulos',
  templateUrl: './frm-planificador-articulos.component.html',
  styleUrls: ['./frm-planificador-articulos.component.css']
})
export class FrmPlanificadorArticulosComponent implements OnInit {

//#region - cte y var de la pantalla  
altoBtnFooter = '45px';
loadingVisible = false;
indicatorUrl = "";
loadingMessage = 'Cargando...'

@ViewChild('container') container: ElementRef;
@ViewChild('btnFooter') btnFooter: ElementRef;
@ViewChild('pantalla') pantalla: ElementRef;

@ViewChild('dgArticulos', { static: false }) dgArticulos: CmpDataGridComponent;
@ViewChild('dgUnidades', { static: false }) dgUnidades: CmpDataGridComponent;

btnAciones: BotonPantalla[] = [
  { icono: '', texto: this.traducir('frm-planificacion.btnSalir', 'Salir'), posicion: 1, accion: () => {this.location.back();}, tipo: TipoBoton.danger, activo: true, visible: true },
  { icono: '', texto: this.traducir('frm-planificacion.btnRecargar', 'Recargar'), posicion: 2, accion: () => {this.limpiarControles();}, tipo: TipoBoton.secondary, activo: true, visible: true },
];

// _salida: Salida;
oOfertaSeleccionada: Salida; 

_articulo: ArticuloStock = new(ArticuloStock);
_listaArticulos: Array<ArticuloStock> = []
_listaIdArticulos: Array<string> = [];
_idAlmacen:number;
_nombreAlmacen:string;


//arrayArts: Array<SalidaLinea> = [];
arrayArts: Array<ArticuloStock> = [];
arrayCabeceras: Array<Salida> = [];
arrayUnidadesOfertas = [];

// grid articulos contrato seleccionado
colsArts: Array<ColumnDataGrid> = [
  { dataField: 'IdArticulo',
    caption: 'Cod.Artículo',
  },
  { dataField: 'NombreArticulo',
    caption: 'Descripción',
  },
  { dataField: 'Unidades',
    caption: 'Stock',
    cssClass: 'blanco',
  },
  { dataField: 'IdAlmacen', caption: '', visible: false },
  { dataField: 'NombreAlmacen', caption: '', visible: false },
  { dataField: 'IdCualidad', caption: '', visible: false },
  { dataField: 'NombreCualidad', caption: '', visible: false },
  { dataField: 'IdFamilia', caption: '', visible: false },   
  { dataField: 'NombreFamilia', caption: '', visible: false },    
  { dataField: 'IdSubfamilia', caption: '', visible: false },    
  { dataField: 'NombreSubfamilia', caption: '', visible: false },    
  { dataField: 'Secundario', caption: '', visible: false},    
]
dgConfigArticulos: DataGridConfig = new DataGridConfig(null, this.colsArts, 100, '');

// grid articulos Contratos Planificados & Unidades
colsUnidades: Array<ColumnDataGrid> = [];
dgConfigUnidades: DataGridConfig = new DataGridConfig(null, this.colsUnidades, 100, '');

WSDatos_Validando: boolean = false;
WSDatos_Valido: boolean = false;

primeraVez: boolean = true; // Indica si está entrando de 0 en la pantalla
alturaDiv: string = '0px';

//popUp menus asociados a los grid
itemsMenuArticulos: any;

//popUp Seleccion de Articulos
@ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
popUpVisibleArticulos:boolean = false;
popUpTitulo:string = "Selección Articulo";

//popUp ver observaciones de contrato
popUpVisibleObservaciones:boolean = false;
str_contrato:string = '';
str_observaciones:string = '';

//#endregion - cte y var de la pantalla

//#region - creación, inicializacion y gestion eventos pantalla
constructor(private cdref: ChangeDetectorRef,
            private renderer: Renderer2,
            private location: Location,
            private router: Router,
            public translate: TranslateService,
            public planificadorService: PlanificadorService,) {
  this.ConstructorPantalla();
}

ConstructorPantalla() {
  // obtenemos dato identificacion de envio del routing
  const nav = this.router.getCurrentNavigation().extras.state;
  if(Utilidades.isEmpty(nav)) return;
  //this._salida = nav.salida;
  this._articulo = nav.Articulo;
  this._idAlmacen = nav.Articulo.IdAlmacen;
  this._nombreAlmacen = nav.Articulo.NombreAlmacen;
  this._listaArticulos.push(nav.Articulo);
  this._listaIdArticulos.push(nav.Articulo.IdArticulo);


  //configuración menu articulos
  this.itemsMenuArticulos= [{ text: 'Reemplazar artículo' },
                            { text: 'Eliminar artículo' },
                            { text: 'Añadir artículo' }, 
                            { text: 'Marcar/Desmarcar Secundario' },                              
                            { text: 'Añadir articulos familia' },
  ];
}

  ngOnInit(): void {
    this.getPlanificacionArticulo();
  }

  // para actualizar la altura de btnFooter
  async ngAfterViewInit(): Promise<void> {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // Actualizar altura de los grids
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima) - 210);
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));   
    this.alturaDiv = '210px';

    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();      
  }

  ngAfterContentChecked(): void {
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();   
  }

  onResize(event) {
    this.alturaDiv = '0px';    
    // this.mostrarEspacio = false;
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // Actualizar altura del grid
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima));
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '210px';
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

  mostrarGif_Ok(){
    this.indicatorUrl = "../../assets/gifs/checkBackground.gif"
    this.loadingMessage = "Correto";
    this.loadingVisible = true;
    setTimeout(() => { this.loadingVisible = false; this.indicatorUrl = ''; }, 2000); 
  }

//#endregion - creación, inicializacion y gestion eventos pantalla


//#region - WEB SERVICES

  async getPlanificacionArticulo(){
    if(this.WSDatos_Validando) return;
    
    this.limpiarControles(false);
    if (this._listaIdArticulos.length==0) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getDatosPlanificadorArticulos(this._idAlmacen, this._listaIdArticulos)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSDatos_Valido = true;

          this.arrayArts = this._listaArticulos; // datos.datos.LineasOferta;
          this.arrayCabeceras = datos.datos.OfertasRel;
          this.arrayUnidadesOfertas = datos.datos.LineasOfertasRel;

          // Se configura el grid de artículos
          this.dgConfigArticulos = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigArticulos.actualizarConfig(true,false,'standard');
          
          // Se configura el grid de las unidades
          let nroCol: number = 0;
          this.arrayCabeceras.forEach(c => {
            let newCol: ColumnDataGrid = {
              dataField: c.NombreCliente,
              caption: (this.obtenerCaptionColumna(c.NombreCliente,true)+'.'),
              cssClass: 'cliente',
              columns: [{
                dataField: c.Contrato,
                caption: c.Contrato,
                cssClass: 'contrato',
                columns: [{
                  dataField: c.Obra,
                  caption: this.obtenerCaptionColumna(c.Obra),
                  cssClass: 'otros',
                  columns: [{
                    dataField: c.Referencia,
                    caption: this.obtenerCaptionColumna(c.Referencia),
                    cssClass: 'otros',
                    columns: [{
                      dataField: c.FechaInicio.toString().substring(0, c.FechaInicio.toString().indexOf('T')),
                      caption: this.obtenerFecha(c.FechaInicio.toString()),
                      cssClass: 'fecha',
                      columns: [{
                        dataField: c.FechaFin.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                        caption: this.obtenerFecha(c.FechaFin.toString()), 
                        cssClass: 'fecha',
                        columns: [{
                          dataField: c.NombreEstado,
                          caption: c.NombreEstado,
                          cssClass: 'estado',
                          columns: [{
                            dataField: 'C' + nroCol.toString() + '_PEDIDAS',
                            caption: 'Ped.',
                            cssClass: 'unidades',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_ASIGNADAS',
                            caption: 'Asig.',
                            cssClass: 'unidades',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_DISPONIBLES',
                            caption: 'Dis.',
                            cssClass: 'unidades',
                            allowSorting: false
                          },
                        ]
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }
            
            this.colsUnidades.push(newCol);

            nroCol++;
          });

          this.dgConfigUnidades = new DataGridConfig(this.arrayUnidadesOfertas, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigUnidades.actualizarConfig(true,false,'standard');
        } else {
          this.WSDatos_Valido = false;
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador-articulos');  
        //console.log(error);
      }
    );
  }


// async insertarArticuloPlanificador(idArticulo:string,unidades:number,observaciones:string){
//   if(this.WSDatos_Validando) return;    
//   if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

//   this.WSDatos_Validando = true;
//   (await this.planificadorService.insertarArticuloPlanificador(this.oOfertaSeleccionada.IdSalida,idArticulo,unidades,observaciones)).subscribe(
//     datos => {
//       if(Utilidades.DatosWSCorrectos(datos)) {
//         //console.log(datos);
//         Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSInsertarArticulos','Artículo Insertado correctamente'));           
//         this.WSDatos_Validando = false;
//         this.limpiarControles(true);
//       } else {          
//         this.WSDatos_Validando = false;
//         Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSInsertarArticulos','Error WS insertando artículo')); 
//       }
//     }, error => {
//       this.WSDatos_Validando = false;
//       Utilidades.compError(error, this.router, 'frm-planificador');        
//       //console.log(error);        
//     }
//   );
// }


// async eliminarArticuloPlanificador(idArticulo:string,motivo:string){
//   if(this.WSDatos_Validando) return;    
//   if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

//   this.WSDatos_Validando = true;
//   (await this.planificadorService.eliminarArticuloPlanificador(this.oOfertaSeleccionada.IdSalida,idArticulo,motivo)).subscribe(
//     datos => {
//       if(Utilidades.DatosWSCorrectos(datos)) {
//         //console.log(datos);
//         Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSEliminarArticulos','Artículo Eliminado correctamente'));           
//         this.WSDatos_Validando = false;
//         this.limpiarControles(true);
//       } else {          
//         this.WSDatos_Validando = false;
//         Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSEliminarArticulos','Error WS eliminando artículo')); 
//       }
//     }, error => {        
//       this.WSDatos_Validando = false;
//       Utilidades.compError(error, this.router, 'frm-planificador');        
//       //console.log(error);
//     }
//   );
// }  

  async actulizarArticuloValorSecundario(idArticulo:string,valor:boolean){
    if(this.WSDatos_Validando) return;    
    if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarArticuloValorSecundario(idArticulo,this._idAlmacen,valor)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-planificador-articulos.msgOk_WSActualizarValorSecunadrio','Artículo Actualizado correctamente'),'success',1000); 
          let index:number = this.arrayArts.findIndex(e => e.IdArticulo=idArticulo);
          if (index>=0) { this.arrayArts[index].Secundario = valor; }
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador-articulos.msgError_WSActualizarValorSecunadrio','Error WS actualizando valor prioridad artículo')); 
        }
      }, error => {        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador-articulos');        
      }
    );
  } 

//#endregion - WEB SERVICES  


//#endregion - Gestion ordenacion simultanea de los grid

public async onContentReady_DataGridArticulos(): Promise<void> {
  if(this.primeraVez) {
    await Utilidades.delay(100);
    this.primeraVez = false;
  }

  let scrollable = this.dgArticulos.getScrollable();
  scrollable.on("scroll", () => {
    let scrollArticulos = this.dgArticulos.getScroll();
    if(scrollArticulos !== this.dgUnidades.getScroll())
      this.dgUnidades.setScroll(scrollArticulos);
  });

  // Se obtienen todos los optionColumn de cada columna
  const allColumns = Array.from(Array(this.dgArticulos.DataGrid.instance.columnCount()).keys()).map(index => this.dgArticulos.DataGrid.instance.columnOption(index));
  let columnOptionSorted = allColumns.find(col => !Utilidades.isEmpty(col.sortIndex));

  if(Utilidades.isEmpty(columnOptionSorted)) return;

  // Dependiendo de la columna en la que se ha ordenado se aplica al arrayArts
  switch (columnOptionSorted.dataField) {
    case 'IdArticulo':
      if(columnOptionSorted.sortOrder === 'asc') {
        this.arrayArts.sort((a, b) => 
          a.IdArticulo.localeCompare(b.IdArticulo, 'en', { numeric: true })
        );
      } else {
        this.arrayArts.sort((a, b) => 
          b.IdArticulo.localeCompare(a.IdArticulo, 'en', { numeric: true })
        );
      }
      break;
    case 'NombreArticulo':
      if(columnOptionSorted.sortOrder === 'asc') {
        this.arrayArts.sort((a, b) => 
          a.NombreArticulo.localeCompare(b.NombreArticulo, 'en', { numeric: true })
        );
      } else {
        this.arrayArts.sort((a, b) => 
          b.NombreArticulo.localeCompare(a.NombreArticulo, 'en', { numeric: true })
        );
      }
      break;

//TODO - Revisar      
    // case 'CantidadDisponible':
    //   if(columnOptionSorted.sortOrder === 'asc') {
    //     this.arrayArts.sort((a, b) => 
    //       a.CantidadDisponible - b.CantidadDisponible
    //     );
    //   } else {
    //     this.arrayArts.sort((a, b) => 
    //       b.CantidadDisponible - a.CantidadDisponible
    //     );
    //   }
    //   break;
    // case 'CantidadPedida':
    //   if(columnOptionSorted.sortOrder === 'asc') {
    //     this.arrayArts.sort((a, b) => 
    //       a.CantidadPedida - b.CantidadPedida
    //     );
    //   } else {
    //     this.arrayArts.sort((a, b) => 
    //       b.CantidadPedida - a.CantidadPedida
    //     );
    //   }
    //   break;
    // case 'CantidadReservada':
    //   if(columnOptionSorted.sortOrder === 'asc') {
    //     this.arrayArts.sort((a, b) => 
    //       a.CantidadReservada - b.CantidadReservada
    //     );
    //   } else {
    //     this.arrayArts.sort((a, b) => 
    //       b.CantidadReservada - a.CantidadReservada
    //     );
    //   }
    //   break;


    // case 'CantidadReservada':
    //     if(columnOptionSorted.sortOrder === 'asc') {
    //       this.arrayArts.sort((a, b) => 
    //         a.CantidadReservada - b.CantidadReservada
    //       );
    //     } else {
    //       this.arrayArts.sort((a, b) => 
    //         b.CantidadReservada - a.CantidadReservada
    //       );
    //     } 
    //     break;

    //TODO - revisar
    case 'Stock':
      if(columnOptionSorted.sortOrder === 'asc') {
        this.arrayArts.sort((a, b) => 
          a.Unidades - b.Unidades
        );
      } else {
        this.arrayArts.sort((a, b) => 
          b.Unidades - a.Unidades
        );
      }
      break;

    default:
      break;
  }

  let arrayReordenadoUnidades = [];
  this.arrayArts.forEach(art => {
    this.arrayUnidadesOfertas.forEach(unid => {
      if(art.IdArticulo === unid.IdArticulo)
        arrayReordenadoUnidades.push(unid);
    });
  });

  this.dgConfigUnidades = new DataGridConfig(arrayReordenadoUnidades, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
  this.dgConfigUnidades.actualizarConfig(true,false,'standard');
}

public async onContentReady_DataGridUnidades(): Promise<void> {
  if(this.primeraVez) {
    await Utilidades.delay(100);
    this.primeraVez = false;
  }

  let scrollable = this.dgUnidades.getScrollable();
  scrollable.on("scroll", () => {
    let scrollUnidades = this.dgUnidades.getScroll();
    if(scrollUnidades !== this.dgArticulos.getScroll())
      this.dgArticulos.setScroll(scrollUnidades);
  });
}

public async onFocusedRowChanged_DataGridArticulos(e): Promise<void> {
  // await Utilidades.delay(100);
  let selectedRowIndex = e.row.rowIndex;
  // Se selecciona y se le pasa el foco a la misma línea seleccionada pero en dgUnidades
  this.dgUnidades.DataGrid.instance.selectRowsByIndexes(selectedRowIndex);
  this.dgUnidades.DataGrid.focusedRowIndex = selectedRowIndex;
}

public async onFocusedRowChanged_DataGridUnidades(e): Promise<void>{
  // await Utilidades.delay(100);
  let selectedRowIndex = e.row.rowIndex
  // Se selecciona y se le pasa el foco a la misma línea seleccionada pero en dgArticulos
  this.dgArticulos.DataGrid.instance.selectRowsByIndexes(selectedRowIndex);
  this.dgArticulos.DataGrid.focusedRowIndex = selectedRowIndex;
}

  // color articulos secundarios + añadidos
  onRowPrepared_DataGridArticulos(e){ 
    if (e.rowType==="data") {      
      // priosidad -> art. secundario
      if (e.data.Secundario) { 
        e.rowElement.style.backgroundColor = '#f2f2f2'
      } else {
        e.rowElement.style.backgroundColor = '#FFFFFF'
      }
    }
  }  

  //color celdas unidades
  onCellPrepared_DataGridUnidades(e){     
    // //console.log(e.rowType+' -> columnIndex:'+e.columnIndex+' - rowIndex:'+e.rowIndex+' | value:'+e.value+ ' {'+e.values+'}');
    // // check filas correspondiente a datos
    // if ((e.rowType==="data") && (e.rowIndex != undefined)) {
    //   //console.log('columnIndex:'+e.columnIndex+' - rowIndex:'+e.rowIndex+' | value:'+e.value+ ' {'+e.values+'}');
    //   let estilo:string="";
        
    //   // determinar si estamos en columna contrato seleccionado
    //   // 1. valores unidades contrato seleccionado
    //   if (this.arrayCabeceras[Math.floor(e.columnIndex/3)].IdSalida == this._salida.IdSalida) {
    //     estilo = "valorUnidades_sel";        
    //     // und. pendientes_asignar
    //     if (((e.columnIndex % 3) == 1) && (e.values[e.columnIndex] < e.values[e.columnIndex-1])) {
    //         estilo = "valorUndPendientes_sel";
    //     }
    //     // stock=0
    //     if (((e.columnIndex % 3) == 2) && (e.values[e.columnIndex] == 0)) {
    //         estilo = "valorStockCero"
    //     }                
    //   } 
      
    //   // 2. valores de articulos <> contrato seleccionado
    //   else {
    //     estilo = "valorUnidades";
    //     // und. pendientes_asignar
    //     if (((e.columnIndex % 3) == 1) && (e.values[e.columnIndex] < e.values[e.columnIndex-1])) {
    //       estilo = "valorUndPendientes";
    //     }
    //     // stock=0
    //     if (((e.columnIndex % 3) == 2) && (e.values[e.columnIndex] == 0)) {
    //         estilo = "valorStockCero"
    //     }                
    //   }

    //   e.column.cssClass = estilo;         
    //   console.log('columnIndex:'+e.columnIndex+' - rowIndex:'+e.rowIndex+' | value:'+e.value+ ' {'+e.values+'}'+' - estilo:'+estilo);
    // }    
    
  }    

//#endregion - Gestion ordenacion simultanea de los grid


//#region - Gestion de menus y click asociados a los Grid

//GRID ARTICULOS CONTRATO SELECCIONADO

async itemMenuArticulosClick(e) {
  //if (!e.itemData.items) { alert('The '+e.itemData.text+' item was clicked'); }
  let articulo:ArticuloStock = this.dgArticulos.objSeleccionado();
  switch (e.itemIndex) {     
    //Cambiar articulo 
    case 0: this.cambiarArticulo(articulo);
    break;    
    //Eliminar articulo
    case 1: this.eliminarArticulo(articulo);
    break;
    //Añadir articulo
    case 2: this.anadirArticulo();
    break;
    //marcar/desmarcar secundario
    case 3:         
      this.actualizarValorSecunadrio(articulo);          
    break;      
    //Añadir Familia
    case 4: this.anadirArticulosFamilia();          
    break;
    default: break;
  }
}


// GRID CONTRATOS AFECTADOS PLANIFICACION

onCellDblClick_DataGridUnidades(e){
  //  if (e.rowType=='header' && e.column.cssClass=='cliente') {       
  //    this.cambiarContratoSeleccionado(Math.floor(e.columnIndex/3));  // el indice de la columna asociado al array de datos lo retorna multiplicada por 3 (0,3,6,9,...)
  //  }
 }

onContextMenuPreparing_DataGridUnidades(e) {
   //console.log(e);     
   if (e.target == 'header') {
    // e.items can be undefined
    if (!e.items) e.items = [];
    // ver observaciones
    if (!Utilidades.isEmpty(this.arrayCabeceras[e.columnIndex].Observaciones)) {
      e.items.push({ text: 'Ver Observaciones', onItemClick: () => { this.verObservaciones(e.columnIndex); } });
    }    
  }
  else {
    e.items = []; 
  }
}

itemMenuContratosClick(e) {
  // if (!e.itemData.items) { 
  //   alert('Opcion '+e.itemData.text+' del contrato'+ this.dgUnidades.objSeleccionado().Contrato); 
  // }
}

//#endgion - Gestion de menus y click asociados a los Grid

async eliminarArticulo(articulo:ArticuloStock){
  let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-planificador-articulos.MsgEliminarArticulo', 'El artículo '+articulo.IdArticulo+'-'+articulo.NombreArticulo+' sera eliminado de la planificación.'+'<br>¿Esta seguro que desea Continuar?'), 
                                                             this.traducir('frm-planificador-articulos.TituloConfirmar', 'Confirmar'));  
  if (!continuar) return;
  else {
    //Utilidades.ShowDialogAviso('Funcion no implementada');
    let index = this._listaArticulos.indexOf(articulo);
    if (index>=0) {
      this._listaArticulos.splice(index,1);
      this.obtenerArrayIDsArticulos();
      setTimeout(() => { this.getPlanificacionArticulo(); }, 100);
    }
  }   
}

anadirArticulo(){
  // Seleccionar articulo a añadir
  this.popUpVisibleArticulos=true;
}

async cambiarArticulo(articulo:ArticuloStock){    
  // Utilidades.ShowDialogAviso('Funcion no implementada');
  //eliminar + añadir
  let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-planificador.MsgEliminarArticulo', 'El artículo '+articulo.IdArticulo+'-'+articulo.NombreArticulo+' sera eliminado de la planificación.'+'<br>¿Esta seguro que desea Continuar?'), this.traducir('frm-planificador.TituloConfirmar', 'Confirmar'));  
  if (!continuar) return;
  else {
    // eliminar articulo array
    let index = this._listaArticulos.indexOf(articulo);
    if (index>=0) {
      this._listaArticulos.splice(index,1);
      this.obtenerArrayIDsArticulos();
      setTimeout(() => { this.getPlanificacionArticulo(); }, 100);
    }
    // seleccionar y añadir nuevo articulo
    this.anadirArticulo();
  }      
}

anadirArticulosFamilia(){
  Utilidades.ShowDialogAviso('Funcion no implementada');
}

actualizarValorSecunadrio(articulo:ArticuloStock){
  let valor : boolean = (articulo.Secundario) ? false : true;
  this.actulizarArticuloValorSecundario(articulo.IdArticulo,valor);
}

cerrarSeleccionarArticulo(e){
  if (e != null) {
    // Utilidades.ShowDialogAviso('Funcion no implementada');
    // comprobar articulo no existe previamente
    let index:number = this.arrayArts.findIndex(art=>art.IdArticulo == e.IdArticulo);
    if (index<0) {
      // añadir articulo en la planificación
      this._listaArticulos.push(e);
      this.obtenerArrayIDsArticulos();
      setTimeout(() => { this.getPlanificacionArticulo(); }, 100); 
    } else {
      Utilidades.ShowDialogAviso(this.traducir('frm-planificador-articulos.msgError_ArticuloYaExistente','Artículo ya incluido previamente'))     
    }
  }
  this.popUpVisibleArticulos = false;
}

// -------------------------


verObservaciones(index:number){
  if (!Utilidades.isEmpty(this.arrayCabeceras[index].Observaciones)) {
    this.str_contrato = this.arrayCabeceras[index].Contrato;
    this.str_observaciones = this.arrayCabeceras[index].Observaciones;
    this.popUpVisibleObservaciones = true; 
  } 
  else {
    Utilidades.ShowDialogInfo('El contrato indicada NO tiene observaciones','Sin Observaciones');
  }   
}

public limpiarControles(recargar: boolean = true) {
  //this.arrayArts = null;
  this.arrayCabeceras = null;
  this.arrayUnidadesOfertas = null;
  this.colsUnidades = [];
  this.dgConfigArticulos = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
  this.dgConfigUnidades = new DataGridConfig(null, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);

  if(recargar)
    this.getPlanificacionArticulo();
}

obtenerCaptionColumna(texto:string, rellenar:boolean=false): string {
  let cadena:string = texto.substring(0,Math.min(30,texto.length));
  if (rellenar) cadena = cadena.padEnd(30," ");
  return cadena;
}

obtenerFecha(fecha:string):string {    
  if (fecha.substring(0,4) == '1900') {
    return '-'
  } else {
    let strFecha = fecha.substring(8,10) +'-' + fecha.substring(5,7) + '-' + fecha.substring(0,4);
    return strFecha;
  }    
}

obtenerArrayIDsArticulos() {
  this._listaIdArticulos = [];
  for (let i=0; i<this._listaArticulos.length; i++) {
    this._listaIdArticulos.push(this._listaArticulos[i].IdArticulo);
  }
}

}
