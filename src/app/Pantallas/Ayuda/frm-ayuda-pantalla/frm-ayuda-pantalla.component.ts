import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';

import { Utilidades } from '../../../Utilidades/Utilidades';

import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';
import { DxPopupComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-ayuda-pantalla',
  templateUrl: './frm-ayuda-pantalla.component.html',
  styleUrls: ['./frm-ayuda-pantalla.component.css']
})
export class FrmAyudaPantallaComponent implements OnInit,AfterViewInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-ayuda-pantalla.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
  ];

  WSDatos_Validando: boolean = false;

  //#endregion

  // -----------------------------------------------------------------------------------------
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
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // seleccion almacen por defecto -> evento cambio carga datos.
    this.cargarAyudaPantalla(1);
    
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
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

  async cargarAyudaPantalla(pantalla:number){
    // if (this.WSDatos_Validando) return;
    
    // this.WSDatos_Validando = true;
    // (await this.planificadorService.getAyudaPantalla(pantalla)).subscribe(
    //   (datos) => {

    //     if (Utilidades.DatosWSCorrectos(datos)) {
    //       // asignar valores devuletos
    //       // this.arraySalidas = datos.datos;
    //       // this.dgConfig = new DataGridConfig(this.arraySalidas, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       // if (this.arraySalidas.length>0) { this.dgConfig.actualizarConfig(true,false, 'virtual',true, true);}
    //       // else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
    //     }
    //     else {
    //       Utilidades.MostrarErrorStr(this.traducir('frm-ayuda-pantalla.msgErrorWS_CargarAyuda','Error web-service obtener ayuda pantalla')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, (error) => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-ayuda-pantalla');
    //   }
    // );
  }

  btnSalir() {

  }

}
