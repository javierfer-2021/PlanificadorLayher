import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Salida, SalidaLinea, EstadoSalida } from '../../../Clases/Salida';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-venta-lineas',
  templateUrl: './frm-venta-lineas.component.html',
  styleUrls: ['./frm-venta-lineas.component.css']
})
export class FrmVentaLineasComponent implements OnInit {

  @Input() linea: SalidaLinea;                                            // linea salida a modificar
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
  
  @ViewChild('formSalidaLinea', { static: false }) formSalidaLinea: DxFormComponent;  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-venta-lineas.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-venta-lineas.btnAceptar', 'Aceptar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];

  
  WSDatos_Validando: boolean = false;
  _lineaSalida: SalidaLinea = new(SalidaLinea);

  modoImportacion:boolean = false;

  //#endregion

  
  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              )  { }


  ngOnInit(): void {
    // copiar entrada actual a var_temp (posibilidad cancelar)
    this._lineaSalida = Object.assign({},this.linea); 
    this.modoImportacion = Utilidades.isEmpty(this._lineaSalida.IdSalida);    
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco 
    if (this.modoImportacion) {
      setTimeout(() => { this.formSalidaLinea.instance.getEditor('CantidadPedida').focus(); }, 300);       
    } else {
      setTimeout(() => { this.formSalidaLinea.instance.getEditor('FechaInicio').focus(); }, 300);       
    }
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

  async ActualizarLineaEntrada(){
    this.cerrarPopUp.emit(this._lineaSalida);

    // if(this.WSDatos_Validando) return;
    // this.WSDatos_Validando = true;
    // (await this.planificadorService.actualizarLineaEntrada(this._lineaEntrada.IdEntrada,this._lineaEntrada.IdLinea,this._lineaEntrada.IdArticulo,
    //                                                        this._lineaEntrada.FechaPrevista,this._lineaEntrada.FechaConfirmada,this._lineaEntrada.FechaActualizacion)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.WSDatos_Validando = false;
    //       Utilidades.MostrarExitoStr(this.traducir('frm-venta-lineas.msgOk_WSLineaEntradaActualizada','Linea Salida Actualizada'),'success',1000);          
    //       this.cerrarPopUp.emit(this._lineaEntrada);
    //     } else {          
    //       this.WSDatos_Validando = false;
    //       Utilidades.MostrarErrorStr(this.traducir('frm-venta-lineas.msgError_WSActualizarLineaEntrada','Error WS Actualizando Linea Salida')); 
    //     }        
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-venta-lineas');
    //   }
    // );
  } 

  //#endregion
  
  btnSalir() {
    //this.location.back();
    this.cerrarPopUp.emit(null);
  }

  btnGuardar(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-venta-lineas.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        this.ActualizarLineaEntrada();
      }
    }      
  }

  //#region  - gestion formulario

  // validacion estandar del formulario
  validarFormulario():boolean{
    const res = this.formSalidaLinea.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  // validacion complementaria datos del formulario
  validarDatosFormulario():boolean{
    // // confirmda -> requiere fecha confirmación
    // if ((!Utilidades.isEmpty(this._entrada.Confirmada)) && (this._entrada.FechaConfirmada <= new Date(0))) {
    //   Utilidades.MostrarErrorStr(this.traducir('frm-venta-lineas.msgError_FechaConfirmacionVacia','Debe indicar un valor en el campo Fecha CONFIRMACION'));
    //   return false;
    // }
    return true;
  }
  
  setFormFocus(campo:string){
    try {
      const editor = this.formSalidaLinea.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  //#endregion  - gestion formulario


}
