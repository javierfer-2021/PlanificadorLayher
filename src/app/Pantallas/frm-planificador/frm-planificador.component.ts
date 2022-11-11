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

@Component({
  selector: 'app-frm-planificador',
  templateUrl: './frm-planificador.component.html',
  styleUrls: ['./frm-planificador.component.css']
})
export class FrmPlanificadorComponent implements OnInit, AfterViewInit, AfterContentChecked {
  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  @ViewChild('dgArticulos', { static: false }) dgArticulos: CmpDataGridComponent;
  @ViewChild('dgArticulos2', { static: false }) dgArticulos2: CmpDataGridComponent;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: 'Salir', posicion: 1, accion: () => { }, tipo: TipoBoton.danger, activo: true, visible: true },
    { icono: '', texto: 'Limpiar', posicion: 2, accion: () => { }, tipo: TipoBoton.secondary, activo: true, visible: true },
  ];

  ficheroCsv: File = null;

  arrayArts: Array<oArticulo> = [];

  colsArts: Array<ColumnDataGrid> = [
    {
      dataField: 'Articulo',
      caption: 'Articulo',
    },
    {
      dataField: 'Referencia',
      caption: 'Referencia',
    },
    {
      dataField: 'Unidades',
      caption: 'Unidades',
    },
    {
      dataField: 'Cliente',
      caption: 'Cliente',
    },
    {
      dataField: 'Fecha_Inicial',
      caption: 'Fecha Inicial',
    },
    {
      dataField: 'Fecha_Devolucion',
      caption: 'Fecha Devolución',
    }
  ];

  dgConfigArticulos: DataGridConfig = new DataGridConfig(this.arrayArts, this.colsArts, 0, ConfiGlobal.lbl_NoHayDatos);
  dgConfigArticulos2: DataGridConfig = new DataGridConfig(this.arrayArts, this.colsArts, 0, ConfiGlobal.lbl_NoHayDatos);

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
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer, true, true);

    // Actualizar altura del grid
    let altura: number = Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima,2);
    this.dgArticulos.actualizarAltura(altura);
    this.dgArticulos2.actualizarAltura(altura);
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
    this.dgArticulos.actualizarAltura(0);
    this.dgArticulos2.actualizarAltura(0);

    Utilidades.BtnFooterUpdate(
      this.pantalla,
      this.container,
      this.btnFooter,
      this.btnAciones,
      this.renderer
    );

    // Actualizar altura del grid
    let altura: number = Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigArticulos.alturaMaxima, 2);
    this.dgArticulos.actualizarAltura(altura);
    this.dgArticulos2.actualizarAltura(altura);
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

          // Se configura el grid
          this.dgConfigArticulos = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigArticulos.actualizarConfig(true,true,'standard');

          // Se configura el grid 2
          this.dgConfigArticulos2 = new DataGridConfig(this.arrayArts, this.colsArts, this.dgConfigArticulos2.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          this.dgConfigArticulos2.actualizarConfig(true,true,'standard');
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

  public onContentReady_DataGrid(): void {
    let scroll = this.dgArticulos.getScrollable();
    scroll.on("scroll", () => {
      this.dgArticulos2.setScroll(this.dgArticulos.getScroll());
    });
  }

  public onContentReady_DataGrid2(): void {
    let scroll = this.dgArticulos2.getScrollable();
    scroll.on("scroll", () => {
      this.dgArticulos.setScroll(this.dgArticulos2.getScroll());
    });
  } 

  public limpiarControles() {
    // this.str_txtUbiOrigen = '';

    // this.color_txtUbiOrigen = ConfiGlobal.colorFoco;

    // this.WSUbiOrigen_Validando = false;
    // this.WSUbiOrigen_Valido = false;

    // this.vCambiado_txtUbiOrigen = false;

    // this.txtUbiOrigen.instance.focus();

    this.arrayArts = null;

    this.dgConfigArticulos = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    this.dgConfigArticulos2 = new DataGridConfig(null, this.colsArts, this.dgConfigArticulos2.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
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
  Fecha_Inicial: Date;
  Fecha_Devolucion: Date;
}