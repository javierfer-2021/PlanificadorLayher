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

import { modLineaPlanificador } from '../../../Clases/Planificador';

@Component({
  selector: 'app-frm-planificador',
  templateUrl: './frm-planificador.component.html',
  styleUrls: ['./frm-planificador.component.css']
})
export class FrmPlanificadorComponent implements OnInit, AfterViewInit, AfterContentChecked {

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

  _salida: Salida;
  oOfertaSeleccionada: Salida = new (Salida);   
  arrayArts: Array<SalidaLinea> = [];
  arrayCabeceras: Array<Salida> = [];
  arrayUnidadesOfertas = [];
  
  salidaSel_BtnPlanificar:boolean = true;
  salidaSel_BtnObservaciones:boolean = true;

  idOferta_mostrar: string;
  fechaAlta_mostrar: string;
  fechaInicio_mostrar: string;
  fechaFin_mostrar: string;
  estado_mostrar: string;
  cliente_mostrar: string;
  almacen_mostrar: string;
  obra_mostrar: string;
  referencia_mostrar: string;

  // grid articulos contrato seleccionado
  colsArts: Array<ColumnDataGrid> = [
    { dataField: 'IdLinea',
      caption: 'Id Línea',
      visible: false
    },
    { dataField: 'IdSalida',
      caption: 'Id Salida',
      visible: false
    },
    { dataField: 'IdArticulo',
      caption: 'Cod.Artículo',
    },
    { dataField: 'NombreArticulo',
      caption: 'Descripción',
    },
    { dataField: 'CantidadDisponible',
      caption: 'Cantidad Disponible',
      cssClass: 'blanco',
      visible: false
    },
    { dataField: 'CantidadPedida',
      caption: 'Cantidad Pedida',
      visible: false     
    },
    { dataField: 'CantidadReservada',
      caption: 'Cantidad Reservada',
      visible: false
    },
    { dataField: 'FechaActualizacion',
      caption: 'Fecha Actualización',
      visible: false
    },
    { dataField: 'CantidadDisponible',
      caption: 'Cantidad Disponible',
      visible: false
    },
    { dataField: 'CantidadDisponible',
      caption: 'Cantidad Disponible',
      visible: false
    },   
    { dataField: 'Prioridad',
      caption: 'Prioridad',
      visible: false
    },    
    { dataField: 'Eliminada',
      caption: 'Eliminada',
      visible: false
    },    
    { dataField: 'Insertada',
      caption: 'Insertada',
      visible: false
    },    
    { dataField: 'Observaciones',
      caption: 'Observaciones',
      visible: false
    },    

  ]
  dgConfigArticulos: DataGridConfig = new DataGridConfig(null, this.colsArts, 100, '');
  
  // grid articulos Contratos Planificados & Unidades
  colsUnidades: Array<ColumnDataGrid> = [];
  dgConfigUnidades: DataGridConfig = new DataGridConfig(null, this.colsUnidades, 100, '');

  WSDatos_Validando: boolean = false;
  WSDatos_Valido: boolean = false;

  primeraVez: boolean = true; // Indica si está entrando de 0 en la pantalla
  alturaDiv: string = '0px';

  //menus asociados a los grid
  itemsMenuArticulos: any;
  itemsMenuContratos: any;

  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;
  popUpTitulo:string = "Selección Articulo";

  //popUp ver observaciones de contrato
  popUpVisibleObservaciones:boolean = false;
  str_contrato:string = '';
  str_observaciones:string = '';

  //popUp Editar unidades asignadas linea
  @ViewChild('popUpEditarUndLineas', { static: false }) popUpEditarUndLineas: DxPopupComponent;
  popUpVisibleEditarUndLinea:boolean = false;
  _modLineaArticulo: modLineaPlanificador = new(modLineaPlanificador);
  

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
    this._salida = nav.salida;
    this.oOfertaSeleccionada = this._salida;
    this.salidaSel_BtnPlanificar = !this.oOfertaSeleccionada.Planificar;
    this.salidaSel_BtnObservaciones = !Utilidades.isEmpty(this.oOfertaSeleccionada.Observaciones);

    //configuración menu articulos
    this.itemsMenuArticulos= [{ text: 'Reemplazar artículo' },
                              { text: 'Eliminar artículo' },
                              { text: 'Añadir artículo' }, 
                              { text: 'Marcar/Desmarcar Secundario' },                              
    ];
    //configuración menu contratos -> configurado dinamicamente en evento  "onContextMenuPreparing_DataGridUnidades(e)"
    this.itemsMenuContratos= [];  
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

  async getPlanificacion(){
    if(this.WSDatos_Validando) return;

    this.limpiarControles(false);

    this.mostrarPanelProceso('procesando');
    this.WSDatos_Validando = true;
    (await this.planificadorService.getDatosPlanificador(this._salida.IdSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSDatos_Valido = true;

          this.oOfertaSeleccionada = datos.datos.Oferta[0];
          this.idOferta_mostrar = this.oOfertaSeleccionada.Contrato;
          this.fechaAlta_mostrar = this.obtenerFecha(this.oOfertaSeleccionada.FechaAlta.toString());
          this.fechaInicio_mostrar = this.obtenerFecha(this.oOfertaSeleccionada.FechaInicio.toString());
          this.fechaFin_mostrar = this.obtenerFecha(this.oOfertaSeleccionada.FechaFin.toString());
          this.estado_mostrar = this.oOfertaSeleccionada.NombreEstado;
          this.cliente_mostrar = this.oOfertaSeleccionada.IdClienteERP.toString()+' - '+this.oOfertaSeleccionada.NombreCliente;
          this.almacen_mostrar = this.oOfertaSeleccionada.NombreAlmacen;
          this.obra_mostrar = this.oOfertaSeleccionada.Obra;
          this.referencia_mostrar = this.oOfertaSeleccionada.Referencia;

          this.salidaSel_BtnPlanificar = !this.oOfertaSeleccionada.Planificar;
          this.salidaSel_BtnObservaciones = !Utilidades.isEmpty(this.oOfertaSeleccionada.Observaciones);
      
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
              cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'cliente_sel' : 'cliente',
              columns: [{
                dataField: c.Contrato,
                caption: c.Contrato,
                cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'contrato_sel' : 'contrato',
                columns: [{
                  dataField: c.Obra,
                  caption: this.obtenerCaptionColumna(c.Obra),
                  cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'otros_sel' : 'otros',
                  columns: [{
                    dataField: c.Referencia,
                    caption: this.obtenerCaptionColumna(c.Referencia),
                    cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'otros_sel' : 'otros',
                    columns: [{
                      // dataField: c.FechaInicio.toString().substring(0, c.FechaInicio.toString().indexOf('T')),
                      // caption: c.FechaInicio.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                      dataField: c.FechaInicio.toString().substring(0, c.FechaInicio.toString().indexOf('T')),
                      caption: this.obtenerFecha(c.FechaInicio.toString()),
                      cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'fecha_sel' : 'fecha',
                      columns: [{
                        dataField: c.FechaFin.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                        caption: this.obtenerFecha(c.FechaFin.toString()), //c.FechaFin.toString().substring(0, c.FechaFin.toString().indexOf('T')),
                        cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'fecha_sel' : 'fecha',
                        columns: [{
                          dataField: c.NombreEstado,
                          // mofificamos mostrar estado por campo Planificar
                          //caption: c.NombreEstado,
                          caption: (c.Planificar) ? 'Planificado' : 'SIN Planificar',
                          //cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'estado_sel' : 'estado',
                          cssClass: this.obtenerClasePlanificado((c.Contrato === this.oOfertaSeleccionada.Contrato),c.Planificar),                          
                          columns: [{
                            dataField: 'C' + nroCol.toString() + '_PEDIDAS',
                            caption: 'Ped.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'unidades_sel' : 'unidades',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_ASIGNADAS',
                            caption: 'Asig.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'unidades_sel' : 'unidades',
                            allowSorting: false
                          },
                          {
                            dataField: 'C' + nroCol.toString() + '_DISPONIBLES',
                            caption: 'Dis.',
                            cssClass: (c.Contrato === this.oOfertaSeleccionada.Contrato) ? 'unidades_sel' : 'unidades',
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
          
          // fin exito
          this.ocultarPanelProceso_Exito();

        } else {
          this.WSDatos_Valido = false;
          this.ocultarPanelProceso();
        }
        this.WSDatos_Validando = false;

      }, error => {
        this.WSDatos_Validando = false;
        this.ocultarPanelProceso();
        Utilidades.compError(error, this.router, 'frm-planificador');  
        //console.log(error);
      }
    );
  }

  async insertarArticulo(idArticulo:string,unidades:number,observaciones:string){
    if(this.WSDatos_Validando) return;    
    if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarArticuloPlanificador(this.oOfertaSeleccionada.IdSalida,idArticulo,unidades,observaciones)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //console.log(datos);
          Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSInsertarArticulos','Artículo Insertado correctamente'));           
          this.WSDatos_Validando = false;
          this.limpiarControles(true);
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSInsertarArticulos','Error WS insertando artículo')); 
        }
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
        //console.log(error);        
      }
    );
  }

  async eliminarArticulo(idArticulo:string,motivo:string){
    if(this.WSDatos_Validando) return;    
    if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.eliminarArticuloPlanificador(this.oOfertaSeleccionada.IdSalida,idArticulo,motivo)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //console.log(datos);
          Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSEliminarArticulos','Artículo Eliminado correctamente'));           
          this.WSDatos_Validando = false;
          this.limpiarControles(true);
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSEliminarArticulos','Error WS eliminando artículo')); 
        }
      }, error => {        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
        //console.log(error);
      }
    );
  }  

  async actulizarArticuloValorSecundario(idArticulo:string,valor:boolean){
    if(this.WSDatos_Validando) return;    
    if (Utilidades.isEmpty(this.oOfertaSeleccionada)) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarArticuloValorSecundario(idArticulo,this.oOfertaSeleccionada.IdAlmacen,valor)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSActualizarValorSecunadrio','Artículo Actualizado correctamente')); 
          let index:number = this.arrayArts.findIndex(e => e.IdArticulo=idArticulo);
          if (index>=0) { this.arrayArts[index].Prioridad = valor; }
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSActualizarValorSecunadrio','Error WS actualizando valor prioridad artículo')); 
        }
      }, error => {        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
      }
    );
  } 

  async planificarContratoSalida(idSalida:number){
    if(this.WSDatos_Validando) return;    

    this.WSDatos_Validando = true;
    (await this.planificadorService.planificarContratoSalida(idSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSPlanificarContrato','Contrato Planificado'));           
          this.WSDatos_Validando = false;
          this.limpiarControles(true);
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSPlanificarContrato','Error WS planificar contrato salida')); 
        }
      }, error => {
        //console.log(error);        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
      }
    );
  }

  async desPlanificarContratoSalida(idSalida:number){
    if(this.WSDatos_Validando) return;    

    this.WSDatos_Validando = true;
    (await this.planificadorService.desPlanificarContratoSalida(idSalida)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          //Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSDesPlanificarContrato','Contrato DES-Planificado'));           
          this.WSDatos_Validando = false;
          this.limpiarControles(true);
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSDesPlanificarContrato','Error WS DES-planificar contrato salida')); 
        }
      }, error => {
        //console.log(error);        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
      }
    );
  }  

  async actializarPlanificacionLineas(datosLinea:modLineaPlanificador, listaSalidas:Array<modLineaPlanificador>){
    if(this.WSDatos_Validando) return;    

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarLineasPlanificadas(datosLinea.IdSalida,datosLinea.IdArticulo,datosLinea.UndServidas,listaSalidas)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-planificador.msgOk_WSActualizarPlanificacionLineas','Articulos RE-Planificado'),'success',1000);           
          // actualizar grid de datos     
          this.arrayUnidadesOfertas[datosLinea.Fila] = Object.assign(this.arrayUnidadesOfertas[datosLinea.Fila],datos.datos[0]);
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-planificador.msgError_WSActualizarPlanificacionLineas','Error WS RE-Planificar artículo')); 
        }
      }, error => {
        //console.log(error);        
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router, 'frm-planificador');        
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

  // color articulos secundarios + añadidos
  onRowPrepared_DataGridArticulos(e){ 
    if (e.rowType==="data") {      
      // priosidad -> art. secundario
      if (e.data.Prioridad) { 
        e.rowElement.style.backgroundColor = '#f2f2f2'
      } else {
        e.rowElement.style.backgroundColor = '#FFFFFF'
      }
      // marca articulo insertado
      if (e.data.Insertada) {
        e.rowElement.style.color = 'green'
      } else {
        e.rowElement.style.color = '#000000'
      }
    }
  }  

  //propiedades estilos columnas unidades segun valores celdas.
  onCellPrepared_DataGridUnidades(e){     
    //console.log(e.rowType+' -> columnIndex:'+e.columnIndex+' - rowIndex:'+e.rowIndex+' | value:'+e.value+ ' {'+e.values+'}'); 

    // check filas correspondiente a datos
    if ((e.rowType==="data") && (e.rowIndex != undefined)) {        
      // determinar si estamos en columna contrato seleccionado vs otros contratos      
      // 1. CONTRATO SELECCIONADO --> font-weight=bold 
      if (this.arrayCabeceras[Math.floor(e.columnIndex/3)].IdSalida == this._salida.IdSalida) {
        e.cellElement.style.fontWeight = "bold";
      } 
      
      // 2. COMPROBACION VALORES COLUMNAS PARA CAMBIO COLOR SEGUN VALOR UNIDADES
      // und. pendientes_asignar
      if ( ((e.columnIndex % 3) == 1) && ((e.values[e.columnIndex] < e.values[e.columnIndex-1])) ){
          //console.log('pedidas < asignadas --> '+e.values[e.columnIndex] +','+ e.values[e.columnIndex-1]);
          e.cellElement.style.backgroundColor="lightpink"; 
      }
      // stock=0
      else if ( ((e.columnIndex % 3) == 2) && ((e.values[e.columnIndex] == 0)) ) {
        e.cellElement.style.color="red";
      }
    }  

  }    

//#endregion - Gestion ordenacion simultanea de los grid


//#region - Gestion de menus y click asociados a los Grid

  //GRID ARTICULOS CONTRATO SELECCIONADO
  async itemMenuArticulosClick(e) {
    //if (!e.itemData.items) { alert('The '+e.itemData.text+' item was clicked'); }
    let articulo:SalidaLinea = this.dgArticulos.objSeleccionado();
    switch (e.itemIndex) {     
      //cambiar articulo
      case 0: this.cambiarArticuloSalida(articulo);
      break;
      //eliminar articulo
      case 1: this.eliminarArticuloSalida(articulo);
      break;
      //añadir articulo
      case 2: this.anadirArticuloSalida();          
      break;
      //marcar/desmarcar secundario
      case 3:         
        this.actualizarValorSecunadrio(articulo);          
      break;      
      default: break;
    }
  }


  // GRID CONTRATOS AFECTADOS PLANIFICACION
  onCellDblClick_DataGridUnidades(e){
     if (e.rowType=='header' && e.column.cssClass=='cliente') {       
       this.cambiarContratoSeleccionado(Math.floor(e.columnIndex/3));  // el indice de la columna asociado al array de datos lo retorna multiplicada por 3 (0,3,6,9,...)
     }
     else if ((e.rowType=='data') && (this.arrayCabeceras[Math.floor(e.columnIndex/3)].Planificar) && ((e.columnIndex % 3) == 1) && (e.values[e.columnIndex-1]>0) ) {
      this._modLineaArticulo.Columna =e.columnIndex;
      this._modLineaArticulo.Fila = e.rowIndex;
      this._modLineaArticulo.values = e.values;
      this._modLineaArticulo.IdSalida = this.arrayCabeceras[Math.floor(e.columnIndex/3)].IdSalida;
      this._modLineaArticulo.Contrato = this.arrayCabeceras[Math.floor(e.columnIndex/3)].Contrato;
      this._modLineaArticulo.Cliente = this.arrayCabeceras[Math.floor(e.columnIndex/3)].IdClienteERP + ' - ' + this.arrayCabeceras[Math.floor(e.columnIndex/3)].NombreCliente;
      this._modLineaArticulo.IdArticulo = this.arrayArts[e.rowIndex].IdArticulo;
      this._modLineaArticulo.NombreArticulo = this.arrayArts[e.rowIndex].NombreArticulo;
      this._modLineaArticulo.UndPedidas =  e.values[e.columnIndex-1];
      this._modLineaArticulo.UndServidas =  e.values[e.columnIndex];
      this._modLineaArticulo.UndDisponibles =  e.values[e.columnIndex+1];
      this.popUpVisibleEditarUndLinea = true;
     }
   }
 
  onContextMenuPreparing_DataGridUnidades(e) {
     //console.log(e);     
     if (e.target == 'header') {
      // e.items can be undefined
      if (!e.items) e.items = [];

      // añadimos items personalizados del menu segun columna/fila pulsada
      // seleccionar contrato
      if (this.oOfertaSeleccionada.Contrato != this.arrayCabeceras[e.columnIndex].Contrato) {
        e.items.push({ text: 'Seleccionar Contrato', onItemClick: () => { this.cambiarContratoSeleccionado(e.columnIndex); } });
      }

      // Planificar-DESplanificar
      if (this.arrayCabeceras[e.columnIndex].Planificar) {
        e.items.push({ text: 'DES-Planificar', onItemClick: () => { this.DESplanificarContrato(e.columnIndex); } });       
      } else {
        e.items.push({ text: 'Planificar', onItemClick: () => { this.planificarContrato(e.columnIndex); } });       
      }

      // ver observaciones
      if (!Utilidades.isEmpty(this.arrayCabeceras[e.columnIndex].Observaciones)) {
        e.items.push({ text: 'Ver Observaciones', onItemClick: () => { this.verObservaciones(e.columnIndex); } });
      }

      // cancelar 
      e.items.push({ text: 'Cancelar', onItemClick: () => { this.cancelarContrato(e.columnIndex); } });
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

  async eliminarArticuloSalida(articulo:SalidaLinea){
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-planificador.MsgEliminarArticulo', 'El artículo '+articulo.IdArticulo+'-'+articulo.NombreArticulo+' sera eliminado de la planificación.'+'<br>¿Esta seguro que desea Continuar?'), this.traducir('frm-planificador.TituloConfirmar', 'Confirmar'));  
    if (!continuar) return;
    else {
      //alert('eliminar articulo '+articulo.IdArticulo);      
      // Actualizar SALIDAS_LINEAS
      // Recalcular stock
      // actualizar en array articulos y unidades    
      this.eliminarArticulo(articulo.IdArticulo,"Eliminado desde planificador");
    }   
  }

  anadirArticuloSalida(){
    // Seleccionar articulo a añadir
    this.popUpVisibleArticulos=true;
    // pantalla buscar seleccionar articulo
      // Insertar en SALIDAS_LINEAS
      // Recalcular stock
      // Insertar en array articulos y unidades
  }
 
  async cambiarArticuloSalida(articulo:SalidaLinea){    
    //eliminar + añadir
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-planificador.MsgEliminarArticulo', 'El artículo '+articulo.IdArticulo+'-'+articulo.NombreArticulo+' sera eliminado de la planificación.'+'<br>¿Esta seguro que desea Continuar?'), this.traducir('frm-planificador.TituloConfirmar', 'Confirmar'));  
    if (!continuar) return;
    else {
      // eliminar
      this.eliminarArticulo(articulo.IdArticulo,"Eliminado desde planificador");
      // añadir
      this.anadirArticuloSalida();
    }      
  }

  actualizarValorSecunadrio(articulo:SalidaLinea){
    let valor : boolean = (articulo.Prioridad) ? false : true;
    this.actulizarArticuloValorSecundario(articulo.IdArticulo,valor);
  }

  cerrarSeleccionarArticulo(e){
    if (e != null) {
      // comprobar articulo no existe previamente
      let index:number = this.arrayArts.findIndex(art=>art.IdArticulo == e.IdArticulo);
      if (index<0) {
        // añadir articulo en la planificación
        this.insertarArticulo(e.IdArticulo, e.Unidades,"Insertado desde el planificador");
      } else {
        Utilidades.ShowDialogAviso(this.traducir('frm-planificador.msgError_ArticuloYaExistente','Artículo ya incluido (No insertado).<br>Modifique unidades manualmente'))
      }
    }
    this.popUpVisibleArticulos = false;
  }
 
  btnMostrarObservaciones(){
    this.str_contrato = this.oOfertaSeleccionada.Contrato;
    this.str_observaciones = this.oOfertaSeleccionada.Observaciones;
    this.popUpVisibleObservaciones = true;
  }

  async btnPlanificarContrato(){
    let msgConfirmacion = 'Contrato: '+ this.oOfertaSeleccionada.Contrato +'<br>'
                        + 'Cliente: ' + this.oOfertaSeleccionada.IdClienteERP + ' - ' + this.oOfertaSeleccionada.NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgPlanificarContrato','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloPlanificarContrato', 'Planificar Contrato'));  
    if (!continuar) return
    else {    
      //alert('Planificar CONTRATO: '+this.oOfertaSeleccionada.Contrato);
      this.planificarContratoSalida(this.oOfertaSeleccionada.IdSalida);
    }
  }

  async btnDESplanificarContrato(){
    let msgConfirmacion = 'Contrato: '+ this.oOfertaSeleccionada.Contrato +'<br>'
                        + 'Cliente: ' + this.oOfertaSeleccionada.IdClienteERP + ' - ' + this.oOfertaSeleccionada.NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgPlanificarContrato','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloDesplanificarContrato', 'DES-Planificar Contrato'));  
    if (!continuar) return
    else {    
      //alert('Planificar CONTRATO: '+this.oOfertaSeleccionada.Contrato);
      this.desPlanificarContratoSalida(this.oOfertaSeleccionada.IdSalida);
    }
  }

  cerrarEditarUnidadesArticulo(datos){
    if (datos!=null) {
      console.log(datos);
      
      // actualizar valor modificado
      datos.values[datos.Columna]=datos.UndServidas;

      //construir array para recalculo
      let arrayRecalculoLineas: Array<modLineaPlanificador> = [];
      let lineaRecalculo: modLineaPlanificador;
      for (let col=datos.Columna; col<(this.arrayCabeceras.length*3); col+=3){
        // if cabecera.Planificar y articulo.UndPedidas>0
        lineaRecalculo = new (modLineaPlanificador);
        
        lineaRecalculo.Columna = Math.floor(col/3);
        lineaRecalculo.IdSalida = this.arrayCabeceras[Math.floor(col/3)].IdSalida;
        lineaRecalculo.IdArticulo = this.arrayArts[datos.Fila].IdArticulo;
        lineaRecalculo.UndPedidas = datos.values[col-1];
        lineaRecalculo.UndServidas = datos.values[col];
        lineaRecalculo.UndDisponibles = datos.values[col+1];

        arrayRecalculoLineas.push(lineaRecalculo);
      }
      // console.log(arrayRecalculoLineas);
      //llamar a ws recalculo
      this.actializarPlanificacionLineas(datos, arrayRecalculoLineas);
    }
    this.popUpVisibleEditarUndLinea = false;
  }
  // -------------------------

  async cambiarContratoSeleccionado(index:number){
    let msgConfirmacion = 'Contrato: '+ this.arrayCabeceras[index].Contrato +'<br>'
                        + 'Cliente: ' + this.arrayCabeceras[index].IdClienteERP + ' - ' + this.arrayCabeceras[index].NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgCambiarContratoSeleccionado','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloCambiarContrato', 'Cambiar contrato seleccionado'));  
    if (!continuar) return
    else {
      this._salida = Object.assign({},this.arrayCabeceras[index]);
      this.limpiarControles(false);           
      this.getPlanificacion();
    }
  }

  async planificarContrato(index:number){
    let msgConfirmacion = 'Contrato: '+ this.arrayCabeceras[index].Contrato +'<br>'
                        + 'Cliente: ' + this.arrayCabeceras[index].IdClienteERP + ' - ' + this.arrayCabeceras[index].NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgPlanificarContrato','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloPlanificarContrato', 'Planificar Contrato'));  
    if (!continuar) return
    else {    
      //alert('Planificar CONTRATO: '+this.arrayCabeceras[index].Contrato);
      this.planificarContratoSalida(this.arrayCabeceras[index].IdSalida);
    }
  }

  async DESplanificarContrato(index:number){
    let msgConfirmacion = 'Contrato: '+ this.arrayCabeceras[index].Contrato +'<br>'
                        + 'Cliente: ' + this.arrayCabeceras[index].IdClienteERP + ' - ' + this.arrayCabeceras[index].NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgDesplanificarContrato','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloDesplanificarContrato', 'DES-Planificar Contrato'));  
    if (!continuar) return
    else {    
      //alert('DES-Planificar CONTRATO: '+this.arrayCabeceras[index].Contrato);
      this.desPlanificarContratoSalida(this.arrayCabeceras[index].IdSalida);
    }
  }

  async cancelarContrato(index:number){
    let msgConfirmacion = 'Contrato: '+ this.arrayCabeceras[index].Contrato +'<br>'
                        + 'Cliente: ' + this.arrayCabeceras[index].IdClienteERP + ' - ' + this.arrayCabeceras[index].NombreCliente +'<br><br>'
                        + this.traducir('frm-planificador.MsgCancelarContrato','¿Esta seguro que desea continuar?');
    let continuar = <boolean>await Utilidades.ShowDialogString(msgConfirmacion, this.traducir('frm-planificador.TituloCancelarContrato', 'Cancelar Contrato'));  
    if (!continuar) return
    else {    
      alert('PENDIENTE IMPLEMENTAR -> CANCELAR CONTRATO: '+this.arrayCabeceras[index].Contrato);
      //this.desPlanificarContratoSalida(this.arrayCabeceras[index].IdSalida);
    }
  }

  verObservaciones(index:number){
    if (!Utilidades.isEmpty(this.arrayCabeceras[index].Observaciones)) {
      this.str_contrato = this.arrayCabeceras[index].Contrato;
      this.str_observaciones = this.arrayCabeceras[index].Observaciones;
      this.popUpVisibleObservaciones = true; 
    } 
    else {
      Utilidades.ShowDialogInfo('La oferta indicada NO tiene observaciones','Sin Observaciones');
    }   
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

  obtenerClasePlanificado(seleccionado:boolean,planificado:boolean):string {
    let estilo:string='';
    if (planificado) { estilo='planificado'} else {estilo='sinPlanificar' }
    if (seleccionado) { estilo = estilo + '_sel'; }
    return estilo;
  }


  //#region -- gestion loadPanel

  async mostrarPanelProceso (mensaje?:string) {
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      this.loadingMessage = mensaje;
    }
    this.loadingVisible = true;
  }

  async ocultarPanelProceso () {
    this.indicatorUrl = "";
    this.loadingVisible = false;
  }

  async ocultarPanelProceso_Exito (mensaje?:string) {
    this.indicatorUrl = "../../assets/gifs/checkBackground.gif";
    await Utilidades.delay(1000);
    this.loadingVisible = false;
    this.indicatorUrl = "";
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarExitoStr(mensaje);
    }
  }

  async ocultarPanelProceso_Fallo (mensaje?:string) {
    this.indicatorUrl = "";
    this.loadingVisible = false;
    if (!Utilidades.isEmpty(mensaje)) {
      Utilidades.MostrarErrorStr(mensaje);
    }    
  }  
  
  //#endregion

}

