import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';

import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxTextAreaComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-ayuda-pantalla',
  templateUrl: './frm-ayuda-pantalla.component.html',
  styleUrls: ['./frm-ayuda-pantalla.component.css']
})
export class FrmAyudaPantallaComponent implements OnInit,AfterViewInit {

  @Input() nombrePantalla: string;                                        // nombre pantalla del que buscar ayuda
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('txtInfo', { static: false }) txtInfo: DxTextAreaComponent;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-ayuda-pantalla.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
  ];

  WSDatos_Validando: boolean = false;

  _infoAyuda:InfoAyuda = new InfoAyuda();

  //#endregion

  // -----------------------------------------------------------------------------------------
  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { }

  ngOnInit(): void {
    this.cargarAyudaPantalla(this.nombrePantalla);
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
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

  async cargarAyudaPantalla(pantalla:string){
    if (this.WSDatos_Validando) return;
    
    this.WSDatos_Validando = true;
    (await this.planificadorService.getAyudaPantalla(pantalla)).subscribe(
      (datos) => {

        if (Utilidades.DatosWSCorrectos(datos)) {
          // asignar valores devuletos
          this._infoAyuda = datos.datos.Ayuda[0];
          // this.arraySalidas = datos.datos;
        }
        else {
          Utilidades.MostrarErrorStr(this.traducir('frm-ayuda-pantalla.msgErrorWS_CargarAyuda','Error web-service obtener ayuda pantalla')); 
        }
        this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-ayuda-pantalla');
      }
    );
  }

  btnSalir() {
    this.cerrarPopUp.emit(null);
  }

  mostrarDocumento() {
    alert('mostrar documento');
  }

  mostrarVideo() {
    alert('mostrar video');
  }

}


export class InfoAyuda {
  IdAyuda:number;
  IdPantalla:number;
  NombrePantalla:string;
  Texto:string;
  Documento:string='';
  Video:string='';
}