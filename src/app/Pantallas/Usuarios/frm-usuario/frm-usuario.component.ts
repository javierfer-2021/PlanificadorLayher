import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Usuario } from '../../../Clases/Usuario';
import { Almacen,Idioma } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxCheckBoxComponent, DxFormComponent, DxPopupComponent } from 'devextreme-angular';
import { DxListModule, DxListComponent } from 'devextreme-angular/ui/list';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-frm-usuario',
  templateUrl: './frm-usuario.component.html',
  styleUrls: ['./frm-usuario.component.css']
})
export class FrmUsuarioComponent implements OnInit,AfterViewInit,AfterContentChecked {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;
  PantallaAnterior: string = '';
  usarLocationBack: boolean= false;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;
  
  @ViewChild('formUsuario', { static: false }) formUsuario: DxFormComponent; 
  @ViewChild('cbBaja', { static: false }) cbBaja: DxCheckBoxComponent;    
  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnSalir', 'Salir'), posicion: 1, accion: () => {this.btnSalir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnEditar', 'Editar'), posicion: 2, accion: () => {this.btnEditarUsuario()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-usuario.btnNuevo', 'Nuevo'), posicion: 3, accion: () => {this.btnNuevoUsuario()}, tipo: TipoBoton.secondary },
  ];
  
  btnAcionesEdicion: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;

  _usuario: Usuario = new(Usuario);
  _usuarioCopia: Usuario = new(Usuario);

  arrayIdiomas: Array<Idioma> = ConfiGlobal.arrayIdiomas;  
  arrayAlmacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesActivos;  

  arrayAlmacenesDisponibles: Array<Almacen> = new Array<Almacen>();  //ConfiGlobal.arrayAlmacenesActivos;  
  arrayAlmacenesAsignados: Array<Almacen> = new Array<Almacen>();    //[];

  checkBoxBajaOptions: any;
  modoEdicion: boolean = false;
  nuevoUsuario: boolean = false;
 
  //TODO - limpiar no valido + html

  // passwordMode: string;
  // passwordButton: any;
  textBoxPasswordOptions: any;

  // itemsMenuVerClave: any;
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
      // this.itemsMenuVerClave =  [{text: 'Reemplazar artículo' }];
     
      // gestion dinamica checkBox campo BAJA del form
      this.checkBoxBajaOptions = {
        // text: 'Baja',
        // value: true,
        disabled: false,
        onValueChanged: (e) => {
          if ((this._usuario!=null) && (this._usuario!=undefined)) {
            if (e.component.option('value')) {
              this._usuario.FechaBaja= new Date();
            } else {              
              this._usuario.FechaBaja= null;
            } 
          }
        },
      }; 

      // gestion boton ver password  
      this.textBoxPasswordOptions = {
        disabled: false,
        mode:'password',
        buttons: [
          { name:'pass',
            location:'after',
            icon: 'info',
            text: 'V',
            hint: 'Ver password',
            onClick:(e) => { alert('boton ver password');}
          }
        ]
      }

      
      // // gestion boton ver password      
      // this.passwordMode = 'password';
      // this.passwordButton = {
      //   icon: 'edit',
      //   type: 'default',
      //   onClick: () => {
      //     this.passwordMode = (this.passwordMode === 'text') ? 'password' : 'text';
      //   },
      // };

      // obtenemos dato identificacion de envio del routing
      const nav = this.router.getCurrentNavigation().extras.state;      
      if (( nav.usuario !== null) && ( nav.usuario !== undefined)) {
        this._usuario= nav.usuario;
      }
      else {
        this._usuario = new Usuario();
        this._usuario.IdUsuario = -1;
        this.btnNuevoUsuario();
      }
  }


  ngOnInit(): void {
    setTimeout(() => { this.configurarListasAlmacenes();},200);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
   
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
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
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

  async cargarAlmacenes(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaAlmacesUsuario(this._usuario.IdUsuario)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayAlmacenesAsignados = datos.datos;
          
          //arrayAlmacenesDisponibles -> Todos - Asignados al usuario
          this.arrayAlmacenesDisponibles=[];
          for(let i = 0 ; i < this.arrayAlmacenes.length ; i++){
            let alma:Almacen = this.arrayAlmacenes[i];
            if (this.arrayAlmacenesAsignados.findIndex(e => (e.IdAlmacen === alma.IdAlmacen)) === -1) this.arrayAlmacenesDisponibles.push(alma);
          }

        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-usuario.msgError_WSCargarAlmacenes','Error cargando almacenes asociados al usuario')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-usuario');
      }
    );
  } 


  async insertarUsuario(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarUsuario(this._usuario.Login,this._usuario.Password,this._usuario.NombreUsuario,this._usuario.Email,this._usuario.IdIdioma,
                                                    this._usuario.FechaAlta,this._usuario.FechaBaja,this._usuario.Baja,this._usuario.Administrador,this._usuario.VerAlmacenes,
                                                    this._usuario.idAlmacenDefecto,this._usuario.Skin,this._usuario.Perfil,this._usuario.IdPersonal,this.arrayAlmacenesAsignados)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-usuario.msgOk_WSInsertarUsuario','Usuario insertando')); 
          this._usuario = datos.datos[0];
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-usuario.msgError_WSInsertarUsuario','Error insertando nuevo usuario')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-usuario');
      }
    );
  } 


  async actualiarUsuario(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarUsuario(this._usuario.IdUsuario,this._usuario.Login,this._usuario.Password,this._usuario.NombreUsuario,this._usuario.Email,this._usuario.IdIdioma,
                                                    this._usuario.FechaAlta,this._usuario.FechaBaja,this._usuario.Baja,this._usuario.Administrador,this._usuario.VerAlmacenes,
                                                    this._usuario.idAlmacenDefecto,this._usuario.Skin,this._usuario.Perfil,this._usuario.IdPersonal,this.arrayAlmacenesAsignados)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-usuario.msgOk_WSActualizarUsuario','Usuario actualizado')); 
          //this._usuario = datos.datos[0];
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-usuario.msgError_WSActualizarUsuario','Error actualizando usuario')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-usuario');
      }
    );
  }   

  //#endregion
  
  btnSalir() {
    this.location.back();
  }

  btnEditarUsuario(){
    // copiar usuario actual a var_temp (posibilidad cancelar)
    this._usuarioCopia = Object.assign({},this._usuario);
    this.nuevoUsuario = false;
    // edicion
    this.setModoEdicion(true);    
  }

  btnNuevoUsuario(){
    // copiar usuario actual a var_temp (posibilidad cancelar)    
    this._usuarioCopia = Object.assign({},this._usuario);    //Object.assign(this._usuarioCopia,this._usuario);
    // insertar nuevo ususario + valores por defecto   
    this.nuevoUsuario = true;
    this._usuario = new(Usuario);    
    this._usuario.FechaAlta = new Date();
    this._usuario.Baja = false;
    this._usuario.Administrador = false;
    this._usuario.VerAlmacenes = false;
    this._usuario.IdIdioma = 1;
    // edicion
    this.setModoEdicion(true);
  }

  btnCancelar(){
    // Volver al usuario anterior vs volver a pantalla anterior (busqueda)
    if (this._usuarioCopia.IdUsuario != -1) {      
      this._usuario = this._usuarioCopia;
      this.nuevoUsuario = false;
      this.setModoEdicion(false);      
    } 
    else {
      this.location.back();
    }
  }

  btnGuardar(){
    // validar formulario
    if (!this.validarDatosFormulario()) {
      Utilidades.MostrarErrorStr(this.traducir('frm-usuario.msgError_FaltanDatos','Faltan campos obligatorios. Revise el formulario'));
      return;
    }
    else {
      // distingir entre edicion o insercion
      if (this.nuevoUsuario) {
        this.insertarUsuario();
        setTimeout(() => { this.cargarAlmacenes()}, 500);
      } 
      else {
        this.actualiarUsuario();
      }   
      // llamar a ws con datos del formulario
      this.nuevoUsuario = false;
      this.setModoEdicion(false);
    }
  }
  

  setModoEdicion(editar:boolean){
    this.modoEdicion = editar;    
    setTimeout(() => {
      if (editar) {
          Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
      }
      else {
          Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
      }
      }, 100);     
  }

  
  validarDatosFormulario():boolean{
    const res = this.formUsuario.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }


  configurarListasAlmacenes(){
    if (this._usuario.IdUsuario == -1) {
      this.arrayAlmacenesDisponibles = Object.assign({},this.arrayAlmacenes);
      this.arrayAlmacenesAsignados = [];
    }
    else {
      this.cargarAlmacenes();
    }
  }


  onDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  onAdd(e) {
    e.toData.splice(e.toIndex, 0, e.itemData);
  }

  onRemove(e) {
    e.fromData.splice(e.fromIndex, 1);
  }

  // itemMenuVerClave(e){
  //   alert('ver clave');
  // }

}





