import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AfterContentChecked } from '@angular/core';
import { CmpDataGridComponent } from '../../Componentes/cmp-data-grid/cmp-data-grid.component';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { ColumnDataGrid } from '../../Clases/Componentes/ColumnDataGrid';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { DataGridConfig } from '../../Clases/Componentes/DataGridConfig';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { DxContextMenuModule } from 'devextreme-angular';
import { Salida, SalidaLinea } from '../../Clases/Salida'

@Component({
  selector: 'app-frm-planificador',
  templateUrl: './frm-planificador.component.html',
  styleUrls: ['./frm-planificador.component.css']
})
export class FrmPlanificadorComponent implements OnInit, AfterViewInit, AfterContentChecked {

//#region - cte y var de la pantalla  
  altoBtnFooter = '45px';

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('dgArticulos', { static: false }) dgArticulos: CmpDataGridComponent;
  @ViewChild('dgUnidades', { static: false }) dgUnidades: CmpDataGridComponent;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-planificacion.btnSalir', 'Salir'), posicion: 1, accion: () => {this.location.back();}, tipo: TipoBoton.danger, activo: true, visible: true },
    { icono: '', texto: this.traducir('frm-planificacion.btnLimpiar', 'Limpiar'), posicion: 2, accion: () => {this.limpiarControles();}, tipo: TipoBoton.secondary, activo: true, visible: true },
  ];

  _salida: Salida;
  oOfertaSeleccionada: Salida;  
  arrayArts: Array<SalidaLinea> = [];
  arrayCabeceras: Array<Salida> = [];
  arrayUnidadesOfertas = [];
  

  idOferta_mostrar: string;
  fechaAlta_mostrar: string;
  fechaInicio_mostrar: string;
  fechaFin_mostrar: string;
  estado_mostrar: string;
  cliente_mostrar: string;
  almacen_mostrar: string;

  alturaDiv: string = '0px';

  colsArts: Array<ColumnDataGrid> = [
    {
      dataField: 'IdLinea',
      caption: 'Id Línea',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'IdSalida',
      caption: 'Id Salida',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'IdArticulo',
      caption: 'Cod.Artículo',
      cssClass: 'blanco'
    },
    {
      dataField: 'NombreArticulo',
      caption: 'Descripción',
      cssClass: 'blanco'
    },
    {
      dataField: 'CantidadDisponible',
      caption: 'Cantidad Disponible',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'CantidadPedida',
      caption: 'Cantidad Pedida',
      cssClass: 'blanco' ,
      visible: false     
    },
    {
      dataField: 'CantidadReservada',
      caption: 'Cantidad Reservada',
      cssClass: 'blanco',
      visible: false
    },
    {
      dataField: 'FechaActualizacion',
      caption: 'Fecha Actualización',
      cssClass: 'blanco',
      visible: false
    },
    // {
    //   dataField: 'Stock',
    //   caption: 'Stock',
    //   cssClass: 'blanco'
    // }
  ];
  dgConfigArticulos: DataGridConfig = new DataGridConfig(null, this.colsArts, 100, '');
  
  colsUnidades: Array<ColumnDataGrid> = [];
  dgConfigUnidades: DataGridConfig = new DataGridConfig(null, this.colsUnidades, 100, '');

  WSDatos_Validando: boolean = false;
  WSDatos_Valido: boolean = false;

  primeraVez: boolean = true; // Indica si está entrando de 0 en la pantalla

  //popUp menus asociados a los grid
  itemsMenuArticulos: any;
  itemsMenuContratos: any;

//#endregion - cte y var de la pantalla

//#region - creación, inicializacion y gestion eventos pantalla
  constructor(private renderer: Renderer2,
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
    this._salida = nav.salida;

    //configuración menu articulos
    this.itemsMenuArticulos= [{ text: 'Eliminar artículo' },
                              { text: 'Insertar artículo' },
    ];
    //configuración menu contratos
    this.itemsMenuContratos= [{ text: 'Seleccionar Contrato' }];    
  }

  ngOnInit(): void {
    this.getPlanificacion();
  }

  // para actualizar la altura de btnFooter
  async ngAfterViewInit(): Promise<void> {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // Actualizar altura de los grids
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima) - 210);
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '210px';
  }

  ngAfterContentChecked(): void {
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

//#endregion - creación, inicializacion y gestion eventos pantalla


  async getPlanificacion(){
    if(this.WSDatos_Validando) return;

    this.limpiarControles(false);

    this.WSDatos_Validando = true;
    (await this.planificadorService.getDatosPlanificador(this._salida.IdSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSDatos_Valido = true;

          this.oOfertaSeleccionada = datos.datos.Oferta[0];
          this.idOferta_mostrar = this.oOfertaSeleccionada.Contrato;
          this.fechaAlta_mostrar = this.oOfertaSeleccionada.FechaAlta.toString().substring(0, this.oOfertaSeleccionada.FechaAlta.toString().indexOf('T'));
          this.fechaInicio_mostrar = this.oOfertaSeleccionada.FechaInicio.toString().substring(0, this.oOfertaSeleccionada.FechaInicio.toString().indexOf('T'));
          this.fechaFin_mostrar = this.oOfertaSeleccionada.FechaFin.toString().substring(0, this.oOfertaSeleccionada.FechaFin.toString().indexOf('T'));
          this.estado_mostrar = this.oOfertaSeleccionada.NombreEstado;
          this.cliente_mostrar = this.oOfertaSeleccionada.IdCliente.toString()+' - '+this.oOfertaSeleccionada.NombreCliente;
          this.almacen_mostrar = this.oOfertaSeleccionada.NombreAlmacen;

          this.arrayArts = datos.datos.LineasOferta;
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
              cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'verde' : 'gris',
              columns: [{
                dataField: c.Contrato,
                caption: c.Contrato,
                cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'verdeClaro' : 'grisClaro',
                columns: [{
                  dataField: c.Obra,
                  caption: this.obtenerCaptionColumna(c.Obra),
                  cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'blanco' : 'blanco',
                  columns: [{
                    dataField: c.Observaciones,
                    caption: this.obtenerCaptionColumna(c.Observaciones),
                    cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'blanco' : 'blanco',
                    columns: [{
                      dataField: c.FechaInicio.toString().substring(0, c.FechaInicio.toString().indexOf('T')),
                      caption: c.FechaInicio.toString().substring(0, c.FechaInicio.toString().indexOf('T')),
                      cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'fechaBold' : 'fecha',
                      columns: [{
                        dataField: c.FechaFin.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                        caption: c.FechaFin.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                        cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'fechaRojaBold' : 'fechaRoja',
                        columns: [{
                          dataField: c.NombreEstado,
                          caption: c.NombreEstado,
                          cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'rojoClaroBold' : 'rojoClaro',
                          columns: [{
                            dataField: 'C' + nroCol.toString() + '_PEDIDAS',
                            caption: 'Ped.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'grisBold' : 'gris',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_ASIGNADAS',
                            caption: 'Asig.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'grisBold' : 'gris',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_DISPONIBLES',
                            caption: 'Dis.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'grisBold' : 'gris',
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
        console.log(error);
      }
    );
  }

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
      case 'CantidadDisponible':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.CantidadDisponible - b.CantidadDisponible
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadDisponible - a.CantidadDisponible
          );
        }
        break;
      case 'CantidadPedida':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.CantidadPedida - b.CantidadPedida
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadPedida - a.CantidadPedida
          );
        }
        break;
      case 'CantidadReservada':
        if(columnOptionSorted.sortOrder === 'asc') {
          this.arrayArts.sort((a, b) => 
            a.CantidadReservada - b.CantidadReservada
          );
        } else {
          this.arrayArts.sort((a, b) => 
            b.CantidadReservada - a.CantidadReservada
          );
        }
        break;
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
      // case 'Stock':
      //   if(columnOptionSorted.sortOrder === 'asc') {
      //     this.arrayArts.sort((a, b) => 
      //       a.Stock - b.Stock
      //     );
      //   } else {
      //     this.arrayArts.sort((a, b) => 
      //       b.Stock - a.Stock
      //     );
      //   }
      //   break;

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

  public limpiarControles(recargar: boolean = true) {
    this.arrayArts = null;
    this.arrayUnidadesOfertas = null;
    this.arrayCabeceras = null;
    this.oOfertaSeleccionada = null;
    this.fechaAlta_mostrar = null;

    this.colsUnidades = [];

    this.dgConfigArticulos = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigUnidades = new DataGridConfig(null, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);

    if(recargar)
      this.getPlanificacion();
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


  itemMenuArticulosClick(e) {
    //if (!e.itemData.items) { alert('The '+e.itemData.text+' item was clicked'); }
    if (e.itemIndex === 0) {      
      alert('Eliminar Articulo '+ this.dgArticulos.objSeleccionado().IdArticulo);
      // confirmar eliminación
      // Actualizar SALIDAS_LINEAS
      // Recalcular stock
      // actualizar en array articulos y unidades
    }
    else if (e.itemIndex === 1) {
      alert('Añadir Articulo ' + this.dgArticulos.objSeleccionado().IdArticulo);
      // pantalla buscar seleccionar articulo
      // Insertar en SALIDAS_LINEAS
      // Recalcular stock
      // Insertar en array articulos y unidades
    }
  }


  itemMenuContratosClick(e) {
    if (!e.itemData.items) { 
      alert('Opcion '+e.itemData.text+' del contrato'+ this.dgUnidades.objSeleccionado().Contrato); 
    }
  }


  obtenerCaptionColumna(texto:string, rellenar:boolean=false): string {
    let cadena:string = texto.substring(0,Math.min(30,texto.length));
    if (rellenar) cadena = cadena.padEnd(30," ");
    return cadena;
  }

}

