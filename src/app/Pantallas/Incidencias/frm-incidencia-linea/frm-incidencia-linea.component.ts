import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { Incidencia, TipoIncidencia, LineaIncidencia } from '../../../Clases/Incidencia';
import { Almacen } from '../../../Clases/Maestros';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { ConfiGlobal } from 'src/app/Utilidades/ConfiGlobal';
@Component({
  selector: 'app-frm-incidencia-linea',
  templateUrl: './frm-incidencia-linea.component.html',
  styleUrls: ['./frm-incidencia-linea.component.css']
})
export class FrmIncidenciaLineaComponent implements OnInit,AfterViewInit {

  @Input() _incidencia: Incidencia;                                       // incidencia asociada a la linea
  @Input() _lineaIncidencia: LineaIncidencia;                             // linea incidencia a gestionar
  @Output() cerrarPopUp : EventEmitter<any> = new EventEmitter<any>();    // retorno de la pantalla  
  
  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;
  
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formIncidenciaLinea', { static: false }) formIncidenciaLinea: DxFormComponent;  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-incidencia-linea.btnCancelar', 'Cancelar/Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia-linea.btnConfirmar', 'Confirmar/Guardar'), posicion: 2, accion: () => {this.btnGuardarLinea()}, tipo: TipoBoton.success },
  ];
    
  editandoIncidencia: boolean = false;
  WSDatos_Validando: boolean = false;

  // arrayTiposIncidencia: Array<TipoIncidencia> = [];
  // arrayAlmacenes: Array<Almacen> = [];
  // requerirContrato:boolean = true;


  articuloOptions: any = {
    disabled: false,
    showClearButton: true,
    buttons: [
      {
        name: 'clear'
      },          
      {
        name: 'buscarArticulo',
        location: 'after',
        options: {
          icon: 'find',
          type: 'default',
          onClick: () => this.buscarArticulo(),
        },
      },
    ],
  };

  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;

  //popUp Ayuda Pantalla
  @ViewChild('popUpAyuda', { static: false }) popUpAyuda: DxPopupComponent;
  popUpVisibleAyuda:boolean = false;

  //#endregion


  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService
              )  
    { 
      this.editandoIncidencia=true;
    }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer); 
    // foco del form
    if (this.editandoIncidencia) { setTimeout(() => { this.setFormFocus('IdArticulo');}, 300); }
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


  //#region -- botones de acciones principales --
  
  btnSalir() {
    //this.location.back();
    this.cerrarPopUp.emit(null); 
  }

  // async btnCancelar() {
  //   let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-incidencias.MsgConfirmarCancelar', '¿Esta seguro que Cancelar el registro de la incidencia actual?'), 
  //                                                             this.traducir('frm-incidencias.TituloCancelar', 'Cancelar Incidencia'));  
  //   if (!confirmar) return;
  //   else {
  //     this.location.back();
  //   }   
  // } 
  
  
  btnGuardarLinea(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        //this.insertarIncidencia();
        // retornamos linea Incidencia-articulo insertado
        this.cerrarPopUp.emit(this._lineaIncidencia); 
      }
    }     
  }
  
  //#region -- botones de acciones principales --


  //#region - buscar articulos para asociar a la linea -

  buscarArticulo(){
    // comprobar si requiere contrato asociado
    if ( (!Utilidades.isEmpty(this._incidencia.IdTipoDocumento)) && (this._incidencia.IdTipoDocumento != 0) && (Utilidades.isEmpty(this._incidencia.IdDocumento)) ) {
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia.msgError_SeleccinarDocumentoIncidencia','Seleccione primero el documento/contrato asociado a la incidencia'));
      this.setFormFocus('Contrato');
      return;
    }
    this.popUpVisibleArticulos = true;
  }

  cerrarSeleccionarArticulo(datos:any){
    if (datos != null) {
      // asignar articulo      
      this._lineaIncidencia.IdArticulo = datos.IdArticulo;
      this._lineaIncidencia.NombreArticulo = datos.NombreArticulo;
      // establecer unidades por defecto
      if ((this._incidencia.IdTipoDocumento == null) || (this._incidencia.IdTipoDocumento == undefined)) {
        this._lineaIncidencia.Unidades=0;
      }
      if (this._incidencia.IdTipoDocumento<30) {
        this._lineaIncidencia.Unidades=datos.CantidadReservada;
      }
      else if (this._incidencia.IdTipoDocumento == 30) {
        this._lineaIncidencia.Unidades=datos.CantidadPedida;
      }
      this.setFormFocus('Unidades');
    }
    this.popUpVisibleArticulos = false;
  }  

  //#endregion - buscar articulos para asociar a la linea -




  // --

  // validacion estandar del formulario
  validarFormulario():boolean{
    const res = this.formIncidenciaLinea.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }

  // validacion complementaria datos del formulario
  validarDatosFormulario():boolean{      
    // if ((!Utilidades.isEmpty(this._entrada.Confirmada)) && (this._entrada.FechaConfirmada <= new Date(0))) {
    //   Utilidades.MostrarErrorStr(this.traducir('frm-compra-detalles.msgError_FechaConfirmacionVacia','Debe indicar un valor en el campo Fecha CONFIRMACION'));
    //   return false;
    // }
    return true;
  }  

  setFormFocus(campo:string){
    try {
      const editor = this.formIncidenciaLinea.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  // --

  mostrarAyuda(){
    this.popUpVisibleAyuda = true;
  }

  cerrarAyuda(e){
    this.popUpVisibleAyuda = false;
  }

}

