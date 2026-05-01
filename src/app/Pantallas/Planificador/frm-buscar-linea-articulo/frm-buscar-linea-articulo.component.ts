import { Component, OnInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { Utilidades } from '../../../Utilidades/Utilidades';

import { DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-frm-buscar-linea-articulo',
  templateUrl: './frm-buscar-linea-articulo.component.html',
  styleUrls: ['./frm-buscar-linea-articulo.component.css']
})
export class FrmBuscarLineaArticuloComponent implements OnInit {

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
  
  @ViewChild('txtCodArticulo', { static: false }) txtCodArticulo: DxTextBoxComponent;
  
  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario.btnCancelar', 'Cancelar'), posicion: 1, accion: () => {this.btnCancelar()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario.btnGuardar', 'Guardar'), posicion: 2, accion: () => {this.btnGuardar()}, tipo: TipoBoton.success },
  ];
  
  str_txtCodArticulo: string = '';
  color_txtCodArticulo: string = '';
  contratoValido:boolean = false;
  vCambiado_str_txtContrato:boolean = false;
 
  //#endregion
  
  //#region - constructores y eventos inicialización
  constructor(private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    public translate: TranslateService,
    ) {  }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  ngAfterContentChecked(): void {   
    // foco 
    setTimeout(() => { this.txtCodArticulo.instance.focus(); }, 300); 

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

  onEnterKey_campo() {
    this.btnGuardar();
  }

  btnCancelar(){
    this.cerrarPopUp.emit(null);
  }

  btnGuardar(){
    if (!Utilidades.isEmpty(this.str_txtCodArticulo)) {
      this.cerrarPopUp.emit(this.str_txtCodArticulo); 
    }
    else {
      Utilidades.ShowDialogAviso('Codigo Artículo vacio');
    }
  }

}
