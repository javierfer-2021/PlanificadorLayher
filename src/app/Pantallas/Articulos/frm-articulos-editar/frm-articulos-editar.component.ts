import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';

import { ArticuloStock,ArticuloFamilia,ArticuloSubfamilia, Almacen } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { DxCheckBoxComponent, DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-articulos-editar',
  templateUrl: './frm-articulos-editar.component.html',
  styleUrls: ['./frm-articulos-editar.component.css']
})
export class FrmArticulosEditarComponent implements OnInit {

  @Input() articulo: ArticuloStock;                                            // articulo a modificar
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
  
  @ViewChild('formArticulo', { static: false }) formArticulo: DxFormComponent; 
  
  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];
  
  WSDatos_Validando: boolean = false;

  _articuloCopia: ArticuloStock = new(ArticuloStock);

  arrayFamilias: Array<ArticuloFamilia> = [];
  arraySubfamilias: Array<ArticuloSubfamilia> = [];  
  arrayAlmacenes: Array<Almacen>=[]
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
    this._articuloCopia = Object.assign({},this.articulo);    
    // asignar valores array almacenes
    this.arrayAlmacenes.push({IdAlmacen:-1,NombreAlmacen:'TODOS',Prefijo:'T',Activo:false});
    this.arrayAlmacenes.push({IdAlmacen:this._articuloCopia.IdAlmacen,NombreAlmacen:this._articuloCopia.NombreAlmacen,Prefijo:'',Activo:true});
    
    // cargar combos familias y subfamilias
    this.cargarCombos();
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

  async cargarCombos(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaFamiliasSubfamilias(0)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayFamilias = datos.datos.Familias;
          this.arraySubfamilias = datos.datos.Subfamilias;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-articulos-editar.msgError_WSCargarCombos','Error cargando familias y subfamilias')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-articulos-editar');
      }
    );
  } 


  async actualiaArticulo(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    if (Utilidades.isEmpty(this._articuloCopia.IdFamilia)) this._articuloCopia.IdFamilia=0;
    if (Utilidades.isEmpty(this._articuloCopia.IdSubfamilia)) this._articuloCopia.IdSubfamilia=0;

    (await this.planificadorService.actualizarArticulo(this._articuloCopia.IdArticulo,this._articuloCopia.IdFamilia, this._articuloCopia.IdSubfamilia, this._articuloCopia.Secundario,this._articuloCopia.IdAlmacen)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-articulos-editar.msgOk_WSActualizarArticulo','Artículo actualizado')); 
          // salir 
          //this.articulo = this._articuloCopia;          
          this.cerrarPopUp.emit(this._articuloCopia);
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-articulos-editar.msgError_WSActualizarUsuario','Error actualizando artículo')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-articulos-editar');
      }
    );
  }   

  //#endregion
  

  btnCancelar(){
    // Cancelamos cambios -> retorno null
    this.cerrarPopUp.emit(null);
  }

  btnGuardar(){
    // Actualizar articulo + salir si ok
    this.actualiaArticulo();
  }
  
  
  validarDatosFormulario():boolean{
    const res = this.formArticulo.instance.validate();
    // res.status === "pending" && res.complete.then((r) => {
    //   console.log(r.status);
    // });
    return (res.isValid);
  }


}
