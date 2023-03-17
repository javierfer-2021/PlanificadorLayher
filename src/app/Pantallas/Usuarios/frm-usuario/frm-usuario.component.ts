import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmpDataGridComponent } from 'src/app/componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { ColumnDataGrid } from '../../../Clases/Componentes/ColumnDataGrid';
import { DataGridConfig } from '../../../Clases/Componentes/DataGridConfig';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { Usuario } from '../../../Clases/Usuario';
import { Almacen,Idioma } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxFormComponent, DxPopupComponent } from 'devextreme-angular';
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
  arrayIdiomas: Array<Idioma> = ConfiGlobal.arrayIdiomas;  
  arrayAlmacenes: Array<Almacen> = ConfiGlobal.arrayAlmacenesActivos;  

  arrayAlmacenesDisponibles: Array<Almacen> = ConfiGlobal.arrayAlmacenesActivos;  
  arrayAlmacenesAsignados: Array<Almacen> = [];

  checkBoxBajaOptions: any;
  modoEdicion: boolean = false;

  //TODO - Cambiar por permisos
  // // grid almacenes asoiados
  // // [IdOferta,  IdLinea, IdArticulo, ArticuloNombre, CantidadPedida, CantidadReservada, CantidadDisponible, FechaActualizacion ]
  // arrayLineasOferta: Array<OfertaLinea>;
  // cols: Array<ColumnDataGrid> = [
  //   {
  //     dataField: 'IdAlmacen',
  //     caption: this.traducir('frm-usuario.colIdAlmacen','id.Almacen'),
  //     visible: false,
  //   }, 
  //   {
  //     dataField: 'NombreAlmacen',
  //     caption: this.traducir('frm-usuario.colNombreAlmacen','Almacen'),
  //     visible: false,
  //   },     
  //   {
  //     dataField: 'IdArticulo',
  //     caption: this.traducir('frm-usuario.colIdArticulo','Articulo'),
  //     visible: true,
  //   },      
  //   {
  //     dataField: 'ArticuloNombre',
  //     caption: this.traducir('frm-usuario.colNombreArticulo','Descripción'),
  //     visible: true,
  //   },    
  //   {
  //     dataField: 'CantidadPedida',
  //     caption: this.traducir('frm-usuario.colUndPedidas','Und.Pedidas'),      
  //     visible: true,
  //     width: 150,
  //   },
  //   {
  //     dataField: 'CantidadReservada',
  //     caption: this.traducir('frm-usuario.colUndPedidas','Und.Reservadas'),      
  //     visible: true,
  //     width: 150,
  //   },    
  //   {
  //     dataField: 'CantidadDisponible',
  //     caption: this.traducir('frm-usuario.colUndDisponibles','Disponibles'),      
  //     visible: true,
  //     width: 150,
  //   },   
  //   {
  //     dataField: 'FechaActualizacion',
  //     caption: this.traducir('frm-usuario.colAvisos','Fec.Actualización'),
  //     visible: false,
  //   },       
  // ];
  // dgConfigLineas: DataGridConfig = new DataGridConfig(null, this.cols, 100, '', );

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
      if (( nav.usuario !== null) && ( nav.usuario !== undefined)) {
        this._usuario= nav.usuario;
      }

      // gestion dinamica checkBox campo BAJA del form
      this.checkBoxBajaOptions = {
        // text: 'Show Address',
        // value: true,
        disabled: true,
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

    }


  ngOnInit(): void {
    this.cargarCombos();
    setTimeout(() => {this.cargarPermisos();},1000);
  }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
    // redimensionar grid, popUp
    // setTimeout(() => {
    //   this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
    // }, 200);    
    // foco 
    this.formUsuario.instance.getEditor('Referencia').focus();
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    //this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfigLineas.alturaMaxima));
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
    // (await this.planificadorService.getCombos_PantallaOfertas()).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.arrayTiposEstadoOferta = datos.datos.ListaEstados;
    //       this.arrayAlmacenes = datos.datos.ListaAlmacenes;          
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-ventas-detalles.msgError_WSCargarCombos','Error cargando valores Estados/Almacenes')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     console.log(error);
    //   }
    // );
  }  

  async cargarPermisos(){
    // if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.getLineasOferta(this._oferta.IdOferta)).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       this.arrayLineasOferta = datos.datos;
    //       // Se configura el grid
    //       this.dgConfigLineas = new DataGridConfig(this.arrayLineasOferta, this.cols, this.dgConfigLineas.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
    //       this.dgConfigLineas.actualizarConfig(true,false,'standard');
    //     } else {          
    //       this.WSEnvioCsv_Valido = false;
    //       Utilidades.MostrarErrorStr(this.traducir('frm-ventas-detalles.msgError_WSCargarLineas','Error cargando lineas de la oferta')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     console.log(error);
    //   }
    // );
  } 

  //#endregion
  
  btnSalir() {
    this.location.back();
  }

  btnEditarUsuario(){
    this.setModoEdicion(true);
    //alert('Función no implementada')
  }

  btnNuevoUsuario(){
    alert('Función no implementada');
    // copiar usuario actual a var_temp
    // insertar nuevo ususario
    this.setModoEdicion(true);
  }

  btnCancelar(){
    alert('Función no implementada');
    // distingir entre edicion o insercion
    // volver a pantalla anterio vs volver al usuario anterior
    // llamar a ws con datos del formulario

    this.setModoEdicion(false);
  }

  btnGuardar(){
    alert('Función no implementada');
    // distingir entre edicion o insercion
    // validar formulario
    // llamar a ws con datos del formulario
    this.setModoEdicion(false);
  }
  

  setModoEdicion(editar:boolean){
    this.modoEdicion = editar;
    this.checkBoxBajaOptions.disabled = !editar;
    setTimeout(() => {
      if (editar) {
          Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAcionesEdicion, this.renderer);
      }
      else {
          Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
      }
      }, 100);     
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


}





