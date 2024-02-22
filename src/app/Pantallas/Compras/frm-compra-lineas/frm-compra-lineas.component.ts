import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Entrada, EntradaLinea, EstadoEntrada } from '../../../Clases/Entrada';
import { Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent } from 'devextreme-angular';


@Component({
  selector: 'app-frm-compra-lineas',
  templateUrl: './frm-compra-lineas.component.html',
  styleUrls: ['./frm-compra-lineas.component.css']
})
export class FrmCompraLineasComponent implements OnInit {

  @Input() linea: EntradaLinea;                                        // linea entrada a modificar
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
  
  @ViewChild('formEntradaLinea', { static: false }) formEntradaLinea: DxFormComponent;  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-compra-lineas.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-compra-lineas.btnAceptar', 'Aceptar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];

  
  WSDatos_Validando: boolean = false;

  _lineaEntrada: EntradaLinea = new(EntradaLinea);
  
  //arrayTiposEstadoEntrada: Array<EstadoEntrada> = [];  
  //arrayAlmacenes: Array<Almacen> = [];
  //requerirFechaConfirmacion:boolean = false;
  
  //modoEdicion: boolean = false;
  //_entradaCopia: Entrada = new(Entrada);

  // grid lineas Entrada
  // [IdEntrada,  IdLinea, IdArticulo, NombreArticulo, CantidadPedida, CantidadConfirmada, CantidadCancelada, FechaActualizacion ]
  // arrayLineasEntrada: Array<EntradaLinea>;

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
    this._lineaEntrada = Object.assign({},this.linea);    
    //setTimeout(() => {this.cargarCombos();},200);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco 
    this.formEntradaLinea.instance.getEditor('FechaPrevista').focus();
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

  async cargarCombos(){
    // if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // let filtroAlmacen:number= 0; // todos los almacenes activos
    // (await this.planificadorService.getCombos_PantallaEntradas(filtroAlmacen)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.arrayTiposEstadoEntrada = datos.datos.ListaEstados;
    //       this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-compras-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-compras-detalles');
    //   }
    // );
  }  

  async ActualizarLineaEntrada(){
    this.cerrarPopUp.emit(this._lineaEntrada);

    // if(this.WSDatos_Validando) return;
    // this.WSDatos_Validando = true;
    // (await this.planificadorService.actualizarLineaEntrada(this._lineaEntrada.IdEntrada,this._lineaEntrada.IdLinea,this._lineaEntrada.IdArticulo,
    //                                                        this._lineaEntrada.FechaPrevista,this._lineaEntrada.FechaConfirmada,this._lineaEntrada.FechaActualizacion)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.WSDatos_Validando = false;
    //       Utilidades.MostrarExitoStr(this.traducir('frm-compra-lineas.msgOk_WSLineaEntradaActualizada','Linea Entrada Actualizada'),'success',1000);          
    //       this.cerrarPopUp.emit(this._lineaEntrada);
    //     } else {          
    //       this.WSDatos_Validando = false;
    //       Utilidades.MostrarErrorStr(this.traducir('frm-compra-lineas.msgError_WSActualizarLineaEntrada','Error WS Actualizando Linea Entrada')); 
    //     }        
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-compra-lineas');
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
      Utilidades.MostrarErrorStr(this.traducir('frm-compra-lineas.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
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
    const res = this.formEntradaLinea.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  // validacion complementaria datos del formulario
  validarDatosFormulario():boolean{
    // // confirmda -> requiere fecha confirmación
    // if ((!Utilidades.isEmpty(this._entrada.Confirmada)) && (this._entrada.FechaConfirmada <= new Date(0))) {
    //   Utilidades.MostrarErrorStr(this.traducir('frm-compra-lineas.msgError_FechaConfirmacionVacia','Debe indicar un valor en el campo Fecha CONFIRMACION'));
    //   return false;
    // }
    // cantidad cancelada <= cantidad pedida
    if (this._lineaEntrada.CantidadCancelada > this._lineaEntrada.CantidadPedida) {
      Utilidades.MostrarErrorStr(this.traducir('frm-compra-lineas.msgError_UndCanceladaMayorPedidas','Las unidades CANCELADAS deben ser menor o igual a las unidades PEDIDAS'));
      return false;
    }
    return true;
  }
  
  setFormFocus(campo:string){
    try {
      const editor = this.formEntradaLinea.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  //#endregion  - gestion formulario

}
