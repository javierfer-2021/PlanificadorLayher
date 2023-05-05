import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { Incidencia, TipoIncidencia } from '../../../Clases/Incidencia';
import { Almacen } from '../../../Clases/Maestros';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { ConfiGlobal } from 'src/app/Utilidades/ConfiGlobal';

@Component({
  selector: 'app-frm-incidencia',
  templateUrl: './frm-incidencia.component.html',
  styleUrls: ['./frm-incidencia.component.css']
})
export class FrmIncidenciaComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formIncidencia', { static: false }) formIncidencia: DxFormComponent;  

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-incidencia.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-incidencia.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardarIncidencia()}, tipo: TipoBoton.success },
  ];
    
  editandoIncidencia: boolean = false;
  WSDatos_Validando: boolean = false;

  _incidencia: Incidencia;
  arrayTiposIncidencia: Array<TipoIncidencia> = [];
  arrayAlmacenes: Array<Almacen> = [];

  //{disabled:false, dataSource:arrayTiposIncidencia, displayExpr:'NombreTipoIncidencia', valueExpr:'IdTipoIncidencia', searchEnabled: true }
  tipoIncidenciaOptions: any = {
    disabled:false, 
    dataSource: 'arrayTiposIncidencia', 
    displayExpr:'NombreTipoIncidencia', 
    valueExpr:'IdTipoIncidencia', 
    searchEnabled: true, 
    onValueChanged: (e) => { this.onValueChanged_ComboTipoIncidencia(e) }
  }

  contratoOptions: any = {
    disabled: false,
    showClearButton: true,
    buttons: [
      {
        name: 'clear'
      },      
      {
        name: 'buscarContrato',
        location: 'after',
        options: {
          icon: 'find',
          type: 'default',
          onClick: () => this.buscarContrato(),
        },
      },
    ],
  };

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

  //popUp Seleccionar Documento
  @ViewChild('popUpDocumentos', { static: false }) popUpDocumentos: DxPopupComponent;
  popUpVisibleDocumentos:boolean = false;

  //popUp Seleccion de Articulos
  @ViewChild('popUpArticulos', { static: false }) popUpArticulos: DxPopupComponent;
  popUpVisibleArticulos:boolean = false;

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
      // obtenemos dato identificacion de envio del routing
      const nav = this.router.getCurrentNavigation().extras.state;      
      if (( nav.incidencia !== null) && ( nav.incidencia !== undefined)) {
        this._incidencia = nav.incidencia;
        this.editandoIncidencia = false;
        // personalizar botones formulario
        this.btnAciones[0].texto = this.traducir('frm-incidencia.btnSalir', 'Salir');
        this.btnAciones[0].accion = () => {this.btnSalir()}
        this.btnAciones[1].visible = false;
      } else {
        this._incidencia = new(Incidencia);
        this.editandoIncidencia = true;
        this._incidencia.IdUsuario = ConfiGlobal.DatosUsuario.IdUsuario;
        this._incidencia.FechaAlta = new Date();
        this._incidencia.FechaIncidencia = this._incidencia.FechaAlta;
        this._incidencia.IdAlmacen = ConfiGlobal.DatosUsuario.idAlmacenDefecto;
      }
    }


  ngOnInit(): void {
    this.cargarCombos();
    // setTimeout(() => {this.cargarLineasOferta();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // foco 

    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges(); 
    // foco del form
    if (this.editandoIncidencia) this.setFormFocus('IdTipoIncidencia');
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
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    let filtroAlmacen:number= 0; // todos los almacenes activos
    (await this.planificadorService.getCombos_PantallaIncidencias(filtroAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayTiposIncidencia = datos.datos.ListaTipos;
          this.tipoIncidenciaOptions = { dataSource: this.arrayTiposIncidencia }
          this.arrayAlmacenes = datos.datos.ListaAlmacenes;  
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencias.msgError_WSCargarCombos','Error cargando valores Tipos Incidencia/Almacenes')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  }  

  async insertarIncidencia(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarIncidencia(this._incidencia.IdTipoIncidencia,this._incidencia.FechaAlta,this._incidencia.FechaIncidencia,this._incidencia.Descripcion,
                                                       this._incidencia.IdAlmacen,this._incidencia.IdDocumento,this._incidencia.IdTipoDocumento,this._incidencia.Contrato,
                                                       this._incidencia.IdCliProv,this._incidencia.NombreCliProv,this._incidencia.IdArticulo,this._incidencia.Unidades,this._incidencia.Observaciones )).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-incidencias.msgOk_WSInsertandoIncidencia','Incidencia Insertada Correctamente'));           
          //this._incidencia = datos.datos[0];
          this.location.back();          
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-incidencias.msgError_WSInsertandoIncidencia','Error Insertando Incidencia')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        console.log(error);
      }
    );
  } 

  //#endregion
  
  btnCrearIncidencia() {   
  }

  btnLimpiarIncidencia(){    
  }  

  btnSalir() {
    this.location.back();
  }

  async btnCancelar() {
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-incidencias.MsgConfirmarCancelar', '¿Esta seguro que Cancelar el registro de la incidencia actual?'), 
                                                              this.traducir('frm-incidencias.TituloCancelar', 'Cancelar Incidencia'));  
    if (!confirmar) return;
    else {
      this.location.back();
    }   
  } 
  
  
  btnGuardarIncidencia(){
    // validar formulario
    if (!this.validarFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia.msgError_ErrorValidacionDatos','Faltan datos y/o Datos incorrectos. Revise el formulario'));
      return;
    }
    else {
      // validacion especifica adicional de datos
      if (this.validarDatosFormulario()) {
        this.insertarIncidencia();
      }
    }     
  }
  
  buscarContrato(){
    //Utilidades.ShowDialogAviso('Buscar Contrato -> Funcion no implementada')
    if (Utilidades.isEmpty(this._incidencia.IdTipoIncidencia)){
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia.msgError_SeleccinarTipoIncidencia','Seleccione primero el tipo de incidencia'));
      this.setFormFocus('IdTipoIncidencia');
      return;
    } else if ((Utilidades.isEmpty(this._incidencia.IdTipoDocumento)) || (this._incidencia.IdTipoDocumento == 0)){
      Utilidades.MostrarErrorStr(this.traducir('frm-incidencia.msgError_NoContratoAsociado','El tipo incidencia no requiere contrato asociado'));
      this.setFormFocus('IdTipoIncidencia');
      return;
    } else {
      this.popUpVisibleDocumentos = true;
    }    
  }

  cerrarSeleccionarDocumento(datos:any){
    if (datos != null) {
      // actualizamos info
    }
    this.popUpVisibleDocumentos = false;
  }

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
      this.setFormFocus('Unidades');
    }
    this.popUpVisibleArticulos = false;
  }  



  // validacion estandar del formulario
  validarFormulario():boolean{
    const res = this.formIncidencia.instance.validate();
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
      const editor = this.formIncidencia.instance.getEditor(campo);
      editor.focus();
    } 
    catch {} 
  }

  onValueChanged_ComboTipoIncidencia(e){
    // limpiamos referencias si se ha cambiado tipo doc. asociado
    if (e.previousValue != e.value) {      
      this._incidencia.IdDocumento=null;
      this._incidencia.Contrato=null;
      this._incidencia.IdTipoDocumento=null;      
      this._incidencia.NombreTipoDocumento=null;
      this._incidencia.IdCliProv=null;
      this._incidencia.NombreCliProv=null;
      this._incidencia.SeleccionarArticuloDocumento=null;
      this._incidencia.CoincideAlmacen=null;
    }
    // asignamos tipo documento requerido por el tipo incidencia seleccionado    
    if (e.value != null) {
      let index = this.arrayTiposIncidencia.findIndex( x => x.IdTipoIncidencia === e.value);
      if (index>=0) {
        this._incidencia.IdTipoDocumento = this.arrayTiposIncidencia[index].TipoDocumento;
        this._incidencia.SeleccionarArticuloDocumento = this.arrayTiposIncidencia[index].SeleccionarArticuloDocumento;
        this._incidencia.CoincideAlmacen = this.arrayTiposIncidencia[index].CoincideAlmacen;
      } 
    }
  } 

}

