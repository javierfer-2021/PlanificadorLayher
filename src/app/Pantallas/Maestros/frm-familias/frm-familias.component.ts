import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { BotonMenu } from '../../../Clases/Componentes/BotonMenu';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { ArticuloFamilia } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';


@Component({
  selector: 'app-frm-familias',
  templateUrl: './frm-familias.component.html',
  styleUrls: ['./frm-familias.component.css']
})
export class FrmFamiliasComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-familias.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];

  botonStock: BotonMenu = { icono: './assets/icons/stock.svg', texto: 'Importar Familias', ruta: '', nombre: 'botonImpFamilias', notificacion: 0, desactivado: false,
                            accion: () => {this.btnImportarFamilias() } };
  // botonIniciarPeriodo: BotonMenu = { icono: './assets/icons/servidor-web.svg', texto: 'Iniciar Periodo (Stock)', ruta: '', nombre: 'botonIniciarPeriodo', notificacion: 0, desactivado: false, 
  //                                    accion: () => {this.btnIniciarPeriodo() } };

  WSDatos_Validando: boolean = false;
  
  arrayFamilias: Array<ArticuloFamilia> = [];
  
  
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
    this.cargarFamilias();    
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
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

  async cargarFamilias(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaFamilias()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayFamilias = datos.datos;
          //this.arraySubfamilias = datos.datos.Subfamilias;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-familias.msgError_WSCargarFamilias','Error importando/actualizando maestro de familias')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-familias');
      }
    );
  }   

  async importarFamilias(){
    // if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.importarArticulos()).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       Utilidades.MostrarExitoStr(this.traducir('frm-familias.msgOk_WSImportarFamilias','Maestro familias actualizado correctamente'));           
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-familias.msgError_WSImportarFamilias','Error importando/actualizando maestro de familias')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-familias');
    //   }
    // );
  }  

  //#endregion

  async btnImportarFamilias() {
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-importar-maestros.dlgImportarArticulosMensaje','Recuerde que los datos de stock no son actualizados<br>¿Seguro que desea actualizar el maestro de Artículos?'), 
                                                               this.traducir('frm-importar-maestros.dlgImportarArticulosTitulo', 'Importar Artículos'));
    if (confirmar) {
      this.importarFamilias();  
    }     
  }

  salir() {
    this.location.back();
  }  


}
