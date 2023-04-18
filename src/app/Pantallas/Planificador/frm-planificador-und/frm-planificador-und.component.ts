import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location, NumberSymbol } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';

import { ArticuloStock,ArticuloFamilia,ArticuloSubfamilia, Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';


@Component({
  selector: 'app-frm-planificador-und',
  templateUrl: './frm-planificador-und.component.html',
  styleUrls: ['./frm-planificador-und.component.css']
})
export class FrmPlanificadorUndComponent implements OnInit {

  @Input() lineaArticulo: modLineaPlanificador;                                // articulo y unidades a modificar
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formModLineaArticulo', { static: false }) formModLineaArticulo: DxFormComponent; 
  
  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;

  _lineaCopia: modLineaPlanificador = new(modLineaPlanificador);

  modoEdicion: boolean = true;
 
  //#endregion

  
  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              ) { }


  ngOnInit(): void {
    // copia del articulo pasado como parametro
    this._lineaCopia = Object.assign({},this.lineaArticulo);       
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // foco 
    //this.formUsuario.instance.getEditor('Referencia').focus();
   
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

  //#region -- WEB_SERVICES


  //#endregion
  

  btnCancelar(){
    // Cancelamos cambios -> retorno null
    this.cerrarPopUp.emit(null);
  }

  btnGuardar(){
    // Validar valores y confirmar cambio
    if (this.validarFormulario() && this.validarDatosFormulario()) {
      this.cerrarPopUp.emit(this._lineaCopia);
    }    
  }
  
  
  validarFormulario():boolean{
    const res = this.formModLineaArticulo.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }
  
  validarDatosFormulario():boolean{      
    if (this._lineaCopia.UndServidas>this._lineaCopia.UndPedidas)  {
      Utilidades.MostrarErrorStr(this.traducir('frm-planificar-und.msgError_UndServidasMayorPedidas','Las und.Servidas no pueden ser mayor que las und. Pedidas'));
      return false;
    }
    if (this._lineaCopia.UndServidas>this._lineaCopia.UndDisponibles)  {
      Utilidades.MostrarErrorStr(this.traducir('frm-planificar-und.msgError_UndServidasMayorStock','Las und.Servidas no pueden ser mayor que las und. Disponibles'));
      return false;
    }    
    return true;
  }

}

export class modLineaPlanificador {
  IdSalida:number;
  Contrato:string;
  Cliente:string;
  IdLinea:number;
  IdArticulo:string;
  NombreArticulo:string;
  UndPedidas:number;
  UndServidas:number;
  UndDisponibles:number;
}