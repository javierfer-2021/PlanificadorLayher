import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';

import { CmdSelectBoxComponent } from 'src/app/Componentes/cmp-select-box/cmd-select-box.component';
import { DataSelectBoxConfig } from '../../Clases/Componentes/DataSelectBoxConfig';

import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { BotonMenu } from '../../Clases/Componentes/BotonMenu';
import { Utilidades } from '../../Utilidades/Utilidades';
import { Configuracion, Almacen } from '../../Clases/Maestros';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';

@Component({
  selector: 'app-frm-importar-maestros',
  templateUrl: './frm-importar-maestros.component.html',
  styleUrls: ['./frm-importar-maestros.component.css']
})
export class FrmImportarMaestrosComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('sbAlmacenes', { static: false }) sbAlmacenes: CmdSelectBoxComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-configuracion.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];

  botonStock: BotonMenu = { icono: './assets/icons/stock.svg', texto: 'Importar Articulos', ruta: '', nombre: 'botonStock', notificacion: 0, desactivado: false,
                            accion: () => {this.btnImportarArticulos() } };
  botonIniciarPeriodo: BotonMenu = { icono: './assets/icons/servidor-web.svg', texto: 'Iniciar Periodo (Stock)', ruta: '', nombre: 'botonIniciarPeriodo', notificacion: 0, desactivado: false, 
                                     accion: () => {this.btnIniciarPeriodo() } };

  WSDatos_Validando: boolean = false;

  // combo filtro almacenes
  almacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesFiltrosBusqueda;
  sbConfig: DataSelectBoxConfig = new DataSelectBoxConfig(this.almacenes,'NombreAlmacen','IdAlmacen','','Seleccionar Almacen',false);
  
  //#endregion - declaracion de cte y variables 


  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { }

  ngOnInit(): void {
    //this.cargarSalidas(-1);    
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.sbAlmacenes.SelectBox.value=this.almacenes[0].IdAlmacen;
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
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

  //#region - web_services

  async importarArticulos(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.importarArticulos()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-importar-maestros.msgOk_WSImportarArticulos','Maestro de artículos actualizado correctamente'));           
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-importar-maestros.msgError_WSImportarArticulos','Error importando/actualizando maestro de artículos')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-importar-maestros');
      }
    );
  }   

  async importarStockArticulos(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.importarStockArticulos()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-importar-maestros.msgOk_WSImportarStockArticulos','Stock de artículos actualizado correctamente'));           
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-importar-maestros.msgError_WSImportarStockArticulos','Error importando/actualizando Stock de artículos')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-importar-maestros');
      }
    );
  }  

  async iniciarEjercicio(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.iniciarEjercicio()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-importar-maestros.msgOk_WSiniciarEjercicio','Nuevo EJERCICIO Iniciado correctamente'));           
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-importar-maestros.msgError_WSiniciarEjercicio','Error iniciando nuevo ejercicio')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-importar-maestros');
      }
    );
  }   

  //#endregion

  async btnImportarArticulos() {
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-importar-maestros.dlgImportarArticulosMensaje','Recuerde que los datos de stock no son actualizados<br>¿Seguro que desea actualizar el maestro de Artículos?'), 
                                                               this.traducir('frm-importar-maestros.dlgImportarArticulosTitulo', 'Importar Artículos'));
    if (confirmar) {
      this.importarArticulos();  
    }     
  }

  async btnIniciarPeriodo() {
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-importar-maestros.dlgIniciarPeriodoMensaje','¡IMPORTANTE!<br>El maestro de STOCK va a ser actualizado a fecha de hoy<br>y la Planificación será recalculada.<br>¿Seguro que desea Iniciar un Nuevo Ejercicio?'), 
                                                               this.traducir('frm-importar-maestros.dlgIniciarPeriodoTitulo', 'Iniciar Nuevo Ejercicio'));
    if (confirmar) {
      this.iniciarEjercicio();  
    }     
  }

  salir() {
    this.location.back();
  }  

}
