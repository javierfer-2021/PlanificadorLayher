import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { ChangeDetectorRef, AfterContentChecked} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TipoBoton } from '../../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../../Clases/Componentes/BotonPantalla';
import { BotonMenu } from '../../../Clases/Componentes/BotonMenu';
import { Utilidades } from '../../../Utilidades/Utilidades';
import { ArticuloFamilia, ArticuloSubfamilia } from '../../../Clases/Maestros';
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';

import { CmpDataGridComponent } from 'src/app/Componentes/cmp-data-grid/cmp-data-grid.component';
import { ConfiGlobal } from '../../../Utilidades/ConfiGlobal';

@Component({
  selector: 'app-frm-subfamilias',
  templateUrl: './frm-subfamilias.component.html',
  styleUrls: ['./frm-subfamilias.component.css']
})
export class FrmSubfamiliasComponent implements OnInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-subfamilias.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
  ];

  botonStock: BotonMenu = { icono: './assets/icons/stock.svg', texto: 'Importar Sub-Familias', ruta: '', nombre: 'botonImpSubfamilias', notificacion: 0, desactivado: false,
                            accion: () => {this.btnImportarSubfamilias() } };

  WSDatos_Validando: boolean = false;
  
  arraySubfamilias: Array<ArticuloSubfamilia> = [];
  arrayFamilias: Array<ArticuloFamilia> = [];
  
  //#endregion - declaracion de cte y variables 


  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService,
              public planificadorService: PlanificadorService) 
  { }

  ngOnInit(): void {
    this.cargarSubFamilias();    
    setTimeout(() => { this.cargarArrayFamilias() }, 2000);
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
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

  //#region - web_services

  async cargarArrayFamilias(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaFamilias()).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arrayFamilias = datos.datos;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSCargarfamilias','Error cargando lista familias')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-subfamilias');
      }
    );
  }   
  

  async cargarSubFamilias(){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaSubfamilias(0)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          this.arraySubfamilias = datos.datos;
        } else {          
          Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSCargarSubfamilias','Error importando/actualizando maestro de Sub-familias')); 
        }
        this.WSDatos_Validando = false;
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-subfamilias');
      }
    );
  }   

  async importarSubFamilias(){
    // if(this.WSDatos_Validando) return;

    // this.WSDatos_Validando = true;
    // (await this.planificadorService.importarArticulos()).subscribe(
    //   datos => {
    //     if(Utilidades.DatosWSCorrectos(datos)) {
    //       Utilidades.MostrarExitoStr(this.traducir('frm-subfamilias.msgOk_WSImportarsubfamilias','Maestro subfamilias actualizado correctamente'));           
    //     } else {          
    //       Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSImportarsubfamilias','Error importando/actualizando maestro de subfamilias')); 
    //     }
    //     this.WSDatos_Validando = false;
    //   }, error => {
    //     this.WSDatos_Validando = false;
    //     Utilidades.compError(error, this.router,'frm-subfamilias');
    //   }
    // );
  }  


  async actualizarSubFamilias(subfamilia:ArticuloSubfamilia){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.actualizarSubFamilia(subfamilia.IdSubfamilia,subfamilia.IdFamilia,subfamilia.NombreSubfamilia)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-subfamilias.msgOk_WSActualizarFamilia','Maestro subfamilias actualizado correctamente'));           
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSActualizarFamilia','Error importando/actualizando maestro de subfamilias')); 
          this.cargarSubFamilias();
        }        
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-subfamilias');
        this.cargarSubFamilias();
      }
    );
  }  

  async insertarSubFamilias(subfamilia:ArticuloSubfamilia){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.insertarSubFamilia(subfamilia.IdSubfamilia,subfamilia.IdFamilia,subfamilia.NombreSubfamilia)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-subfamilias.msgOk_WSInsertarFamilia','Maestro subfamilias actualizado correctamente'));           
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSInsertarFamilia','Error insertando nueva subfamilia')); 
          this.cargarSubFamilias();
        }        
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-subfamilias');
        this.cargarSubFamilias();
      }
    );
  } 

  async eliminarSubFamilias(subfamilia:ArticuloSubfamilia){
    if(this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.eliminarSubFamilia(subfamilia.IdSubfamilia)).subscribe(
      datos => {
        if(Utilidades.DatosWSCorrectos(datos)) {
          Utilidades.MostrarExitoStr(this.traducir('frm-subfamilias.msgOk_WSEliminarFamilia','Maestro subfamilias actualizado correctamente'));           
          this.WSDatos_Validando = false;
        } else {          
          this.WSDatos_Validando = false;
          Utilidades.MostrarErrorStr(this.traducir('frm-subfamilias.msgError_WSEliminarFamilia','Error eliminando subfamilia')); 
          this.cargarSubFamilias();
        }        
      }, error => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-subfamilias');
        this.cargarSubFamilias();
      }
    );
  } 


  //#endregion

  async btnImportarSubfamilias() {
    let confirmar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-subfamilias.dlgImportarArticulosMensaje','Recuerde que los datos de stock no son actualizados<br>¿Seguro que desea actualizar el maestro de Artículos?'), 
                                                               this.traducir('frm-subfamilias.dlgImportarArticulosTitulo', 'Importar Artículos'));
    if (confirmar) {
      this.importarSubFamilias();  
    }     
  }

  salir() {
    this.location.back();
  }  


  onRowUpdated(data) {
    //console.log(data);
    this.actualizarSubFamilias(data.data);
  }

  onRowRemoved(data) {
    //console.log(data);
    this.eliminarSubFamilias(data.data);
  }

  onRowInserted(data) {
    //console.log(data);
    this.insertarSubFamilias(data.data);
  }

  onInitNewRow(e) {
    // console.log(data);
    // e.data.FechaActualizacion = new(Date);
    // e.data.Importado = false;
    // e.data.UsoFiltro = true;
  }

  onEditingStart(data) {
    // console.log(data);
  }

  onRowInserting(data) {
    //console.log(data);
  }

  onRowUpdating(data) {
    //console.log(data);
  }

  onRowRemoving(data) {
    //console.log(data);
  }

  onSaving(data) {
    //console.log(data);
  }

  onRowValidating(e){    
    //console.log();
  }  

}
