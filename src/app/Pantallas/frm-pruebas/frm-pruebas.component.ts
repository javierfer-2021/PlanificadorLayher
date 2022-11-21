import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AfterContentChecked } from '@angular/core';
import { CmpDataGridComponent } from '../../Componentes/cmp-data-grid/cmp-data-grid.component';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { ColumnDataGrid } from '../../Clases/ColumnDataGrid';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { DataGridConfig } from '../../Clases/DataGridConfig';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonPantalla } from '../../Clases/BotonPantalla';
import { BotonIcono } from '../../Clases/BotonIcono';
import { DxDataGridComponent } from 'devextreme-angular';
import { element } from 'protractor';
@Component({
  selector: 'app-frm-pruebas',
  templateUrl: './frm-pruebas.component.html',
  styleUrls: ['./frm-pruebas.component.css']
})
export class FrmPruebasComponent implements OnInit, AfterViewInit, AfterContentChecked {
  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  @ViewChild('dgArticulos', { static: false }) dgArticulos: CmpDataGridComponent;
  @ViewChild('dgUnidades', { static: false }) dgUnidades: CmpDataGridComponent;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: 'Salir', posicion: 1, accion: () => { }, tipo: TipoBoton.danger, activo: true, visible: true },
    { icono: '', texto: 'Limpiar', posicion: 2, accion: () => { }, tipo: TipoBoton.secondary, activo: true, visible: true },
  ];

  ficheroCsv: File = null;

  arrayArts: Array<oArticulo> = [];
  arrayUnidadesMostrar: Array<oUnidMostrar> = [];

  alturaDiv: string = '0px';

  colsArts: Array<ColumnDataGrid> = [
    {
      dataField: 'Articulo',
      caption: 'Articulo',
      cssClass: 'blanco'
    },
    {
      dataField: 'Referencia',
      caption: 'Referencia',
      cssClass: 'blanco'
    },
    {
      dataField: 'Unidades',
      caption: 'Unidades',
      cssClass: 'blanco'
    },
    {
      dataField: 'Cliente',
      caption: 'Cliente',
      cssClass: 'blanco'
    },
    {
      dataField: 'Fecha_Inicial',
      caption: 'Fecha Inicial',
      cssClass: 'blanco'
    },
    {
      dataField: 'Fecha_Devolucion',
      caption: 'Fecha Devolución',
      cssClass: 'blanco'
    }
  ];

  colsUnidades: Array<ColumnDataGrid> = [
    {
      dataField: 'ESCORANDA',
      caption: 'ESCORANDA',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '003/AP22040179',
        caption: '003/AP22040179',
        cssClass: 'grisClaro',
        columns: [{
          dataField: '',
          caption: '',
          cssClass: 'blanco',
          columns: [{
            dataField: '',
            caption: '',
            cssClass: 'blanco',
            columns: [{
              dataField: '04/05/2022',
              caption: '04/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '10/06/2022',
                caption: '10/06/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris'
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'PROD. MULTIPLE',
      caption: 'PROD. MULTIPLE',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040061',
        caption: '001/AP22040061',
        cssClass: 'gris',
        columns: [{
          dataField: '',
          caption: '',
          cssClass: 'blanco',
          columns: [{
            dataField: '',
            caption: '',
            cssClass: 'blanco',
            columns: [{
              dataField: '26/04/2022',
              caption: '26/04/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '22/05/2022',
                caption: '22/05/2022',
                cssClass: 'fechaRoja',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    },
    {
      dataField: 'TMT ESCENARIOS',
      caption: 'TMT ESCENARIOS',
      cssClass: 'grisClaro',
      columns: [{
        dataField: '001/AP22040058',
        caption: '001/AP22040058',
        cssClass: 'gris',
        columns: [{
          dataField: '001/AP22040114',
          caption: '001/AP22040114',
          cssClass: 'blanco',
          columns: [{
            dataField: 'PODIUM',
            caption: 'PODIUM',
            cssClass: 'blanco',
            columns: [{
              dataField: '12/05/2022',
              caption: '12/05/2022',
              cssClass: 'fecha',
              columns: [{
                dataField: '29/07/2022',
                caption: '29/07/2022',
                cssClass: 'fecha',
                columns: [{
                  dataField: 'UnidadesMostrar',
                  caption: 'Unidades',
                  cssClass: 'gris',
                }]
              }]
            }]
          }]
        }]
      }]
    }
  ];

  dgConfigArticulos: DataGridConfig = new DataGridConfig(null, this.colsArts, 100, '');
  dgConfigUnidades: DataGridConfig = new DataGridConfig(null, this.colsUnidades, 100, '');

  btnIconoEnviar: BotonIcono = 
  {
    icono: 'bi bi-arrow-bar-up', texto: 'Enviar Csv', accion: () => { }
  }

  // str_txtUbiOrigen = '';

  // WSUbiOrigen_Validando: boolean = false;
  // WSUbiOrigen_Valido: boolean = false;

  WSEnvioCsv_Validando: boolean = false;
  WSEnvioCsv_Valido: boolean = false;

  // color_txtUbiOrigen: string = ConfiGlobal.colorFoco;

  // vCambiado_txtUbiOrigen: boolean = false;

  // @ViewChild('txtUbiOrigen', { static: false }) txtUbiOrigen: DxTextBoxComponent;

  constructor(
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    public translate: TranslateService,
    public planificadorService: PlanificadorService,
  ) {
    // se añaden las acciones a lo botones
    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.accion = () => {
          this.location.back();
        };
      }
      if (a.posicion === 2) {
        a.accion = () => {
          this.limpiarControles();
        };
      }
    });

    this.btnIconoEnviar.accion = () => {
      this.cargarDatos();
    }

    this.ConstructorPantalla();
  }

  ngOnInit(): void {
  }

  // para actualizar la altura de btnFooter
  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // Actualizar altura del grid
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima) - 180);
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '180px';
  }

  // añadir los nombres traducidos a los botones
  ngAfterContentChecked(): void {
    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.texto = this.traducir('frm-reubicacion.btnSalir', 'Salir');
      }
    });
  }

  ConstructorPantalla() {
  }

  onResize(event) {
    this.alturaDiv = '0px';
    // this.mostrarEspacio = false;

    Utilidades.BtnFooterUpdate(
      this.pantalla,
      this.container,
      this.btnFooter,
      this.btnAciones,
      this.renderer
    );

    // Actualizar altura del grid
    this.dgArticulos.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima));
    this.dgUnidades.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigUnidades.alturaMaxima));
    
    this.alturaDiv = '180px';
  }

  guardarCsv(file: FileList) {
    this.ficheroCsv = file.item(0);

    const reader = new FileReader();
    // reader.onload = (event: any) => {
    // };
    reader.readAsDataURL(this.ficheroCsv);
  }

  async cargarDatos(){
    if(this.WSEnvioCsv_Validando) return;
    if(Utilidades.isEmpty(this.ficheroCsv)) return;

    this.limpiarControles();

    this.WSEnvioCsv_Validando = true;
    (await this.planificadorService.cargarDatos(this.ficheroCsv)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.WSEnvioCsv_Valido = true;
          console.log(datos);

          this.arrayArts = datos.datos.Articulos;
          // this.arrayUnidadesMostrar = datos.datos.UnidadesMostrar;

          this.arrayUnidadesMostrar = new Array<oUnidMostrar>();
          this.arrayArts.forEach(element => {
            let unidMostrar: oUnidMostrar = new oUnidMostrar();
            unidMostrar.UnidadesMostrar = element.UnidadesMostrar;
            this.arrayUnidadesMostrar.push(unidMostrar);
          });

          // Se configura el grid
          this.dgConfigArticulos = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigArticulos.actualizarConfig(true,false,'standard');

          // Se configura el grid 2
          let newCol: ColumnDataGrid = {
            dataField: 'PROD. MULTIPLE',
            caption: 'PROD. MULTIPLE',
            cssClass: 'grisClaro',
            columns: [{
              dataField: '001/AP22040061',
              caption: '001/AP22040061',
              cssClass: 'gris',
              columns: [{
                dataField: '',
                caption: '',
                cssClass: 'blanco',
                columns: [{
                  dataField: '',
                  caption: '',
                  cssClass: 'blanco',
                  columns: [{
                    dataField: '26/04/2022',
                    caption: '26/04/2022',
                    cssClass: 'fecha',
                    columns: [{
                      dataField: '22/05/2022',
                      caption: '22/05/2022',
                      cssClass: 'fechaRoja',
                      columns: [{
                        dataField: 'UnidadesMostrar',
                        caption: 'Unidades',
                        cssClass: 'gris',
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }
          this.colsUnidades.push(newCol);
          this.dgConfigUnidades = new DataGridConfig(this.arrayUnidadesMostrar, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigUnidades.actualizarConfig(true,false,'standard');
        } else {
          this.WSEnvioCsv_Valido = false;
        }
        this.WSEnvioCsv_Validando = false;
      }, error => {
        this.WSEnvioCsv_Validando = false;
        console.log(error);
      }
    );
  }

  public async onContentReady_DataGridArticulos(): Promise<void> {
    let scrollable = this.dgArticulos.getScrollable();
    scrollable.on("scroll", () => {
      let scrollArticulos = this.dgArticulos.getScroll();
      // MIRAR QUE PASA ERROR InternalError: too much recursion
      // NO HACE SCROLL NI SE SINCRONIZA CON EL OTRO GRID
      // CREO QUE HA SIDO AL AÑADIR MAS COLUMNAS AL DGUNIDADES
      if(scrollArticulos !== this.dgUnidades.getScroll())
        this.dgUnidades.setScroll(scrollArticulos);
    });
    console.log('onContentReady');

  }

  public async onContentReady_DataGridUnidades(): Promise<void> {
    let scrollable = this.dgUnidades.getScrollable();
    scrollable.on("scroll", () => {
      let scrollUnidades = this.dgUnidades.getScroll();
      if(scrollUnidades !== this.dgArticulos.getScroll())
        this.dgArticulos.setScroll(scrollUnidades);
    });
    console.log('onContentReady');
  }

  public limpiarControles() {
    // this.str_txtUbiOrigen = '';

    // this.color_txtUbiOrigen = ConfiGlobal.colorFoco;

    // this.WSUbiOrigen_Validando = false;
    // this.WSUbiOrigen_Valido = false;

    // this.vCambiado_txtUbiOrigen = false;

    // this.txtUbiOrigen.instance.focus();

    this.arrayArts = null;
    this.arrayUnidadesMostrar = null;

    this.dgConfigArticulos = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigUnidades = new DataGridConfig(null, this.colsUnidades, this.dgConfigUnidades.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
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
}

export class oArticulo {
  Articulo: string;
  Referencia: string;
  Unidades: number;
  Cliente: string;
  UnidadesMostrar: number;
  Fecha_Inicial: Date;
  Fecha_Devolucion: Date;
}

export class oUnidMostrar {
  UnidadesMostrar: number;
}