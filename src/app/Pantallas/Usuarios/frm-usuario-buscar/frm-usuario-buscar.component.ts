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
import { PlanificadorService } from '../../../Servicios/PlanificadorService/planificador.service';
import { locale } from 'devextreme/localization';

@Component({
  selector: 'app-frm-usuario-buscar',
  templateUrl: './frm-usuario-buscar.component.html',
  styleUrls: ['./frm-usuario-buscar.component.css']
})
export class FrmUsuarioBuscarComponent implements OnInit,AfterViewInit {

  //#region - declaracion de cte y variables 
  altoBtnFooter = '45px';
  clickNoPeticion: boolean = false;
  verLabelHtml: boolean = true;

  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @ViewChild('dg', { static: false }) dg: CmpDataGridComponent; 

  btnAciones: BotonPantalla[] = [
    { icono: '', texto: this.traducir('frm-usuario-buscar.btnSalir', 'Salir'), posicion: 1, accion: () => {this.salir()}, tipo: TipoBoton.danger },
    { icono: '', texto: this.traducir('frm-usuario-buscar.btnEditar', 'Ver Detalles'), posicion: 2, accion: () => {this.btnDetallesUsuario()}, tipo: TipoBoton.secondary },
    { icono: '', texto: this.traducir('frm-usuario-buscar.btnAltaUsuario', 'Nuevo Usuario'), posicion: 3, accion: () => {this.btnNuevoUsuario()}, tipo: TipoBoton.secondary },
  ];

  WSDatos_Validando: boolean = false;

  // grid lista usuarios
  // [IdUsuario, NombreUsuario, IdPerfil, NombrePerfil, Login, Password, IdIdioma, NombreIdioma, Email, Activo, Conectado, FechaAlta]
  arrayUsuarios: Array<Usuario>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 120,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "info",
          hint: "Ver detalles usuario",
          onClick: (e) => { 
            this.btnMostrarUsuario(e.row.rowIndex); 
          }
        },
        { icon: "edit",
          hint: "Editar usuario",
          onClick: (e) => { 
            this.btnMostrarUsuario(e.row.rowIndex); 
          }
        },   
        { icon: "trash",
          hint: "Eliminar usuario",
          onClick: (e) => { 
            this.btnMostrarUsuario(e.row.rowIndex); 
          }
        },                
      ]
    },
    {
      dataField: 'IdUsuario',
      caption: this.traducir('frm-usuario-buscar.colIdUsuario','Id.Usuario'),
      visible: false,
    },      
    {
      dataField: 'NombreUsuario',
      caption: this.traducir('frm-usuario-buscar.colNombre','Nombre'),
      visible: true,
    },    
    {
      dataField: 'IdPerfil',
      caption: this.traducir('frm-usuario-buscar.colIdPerfil','Id.Perfil'),
      visible: false,      
    },
    {
      dataField: 'NombrePerfil',
      caption: this.traducir('frm-usuario-buscar.colNombrePerfil','Perfil'),
      visible: true,
    },
    {
      dataField: 'Login',
      caption: this.traducir('frm-usuario-buscar.colLogin','Login'),
      visible: false,
    },
    {
      dataField: 'Password',
      caption: this.traducir('frm-usuario-buscar.colPassword','Password'),
      visible: false,
    },
    {
      dataField: 'IdIdioma',
      caption: this.traducir('frm-usuario-buscar.colIdIdioma','Id.Idioma'),
      visible: false,      
    },
    {
      dataField: 'NombreIdioma',
      caption: this.traducir('frm-usuario-buscar.colNombreIdioma','Idioma'),
      visible: true,
    }, 
    {
      dataField: 'Email',
      caption: this.traducir('frm-usuario-buscar.colEmail','Email'),
      visible: true,
    },        
    {
      dataField: 'Conectado',
      caption: this.traducir('frm-usuario-buscar.colConectado','Conectado'),
      visible: false,
      dataType: 'boolean',
    },
    {
      dataField: 'Activo',
      caption: this.traducir('frm-usuario-buscar.colActivo','Activo'),
      visible: true,
      dataType: 'boolean',
    },                    
    {
      dataField: 'FechaAlta',
      caption: this.traducir('frm-usuario-buscar.colFechaAlta','Fecha Alta'),
      visible: false,
      dataType: 'date',
    },
  ];
  dgConfig: DataGridConfig = new DataGridConfig(null, this.cols, 100, '' );

  selectedRowsData = [];

  //#endregion

  //#region - constructores y eventos inicialización

  constructor(private cdref: ChangeDetectorRef,
    private renderer: Renderer2,
    private location: Location,
    private router: Router,
    public translate: TranslateService,
    public planificadorService: PlanificadorService) 
  { 
  // Asignar localizacion ESPAÑA
    locale('es');
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }


  ngAfterViewInit(): void {
    Utilidades.BtnFooterUpdate(this.pantalla, this.container, this.btnFooter, this.btnAciones, this.renderer);

    // configuracion extra del grid -> mostrar fila total registros
    this.dg.mostrarFilaSumaryTotal('IdUsuario','Nombre',this.traducir('frm-usuario-buscar.TotalRegistros','Total Usuarios: '),'count');

    // redimensionar grid, popUp
    setTimeout(() => {
      this.dg.panelBusqueda(true);
      this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
    }, 200);
  
    // foco
    this.dg.DataGrid.instance.focus();    
  
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
    }

  ngAfterContentChecked(): void {   
    // eliminar error debug ... expression has changed after it was checked.
    this.cdref.detectChanges();    
  }

  onResize(event) {
    Utilidades.BtnFooterUpdate(this.pantalla,this.container,this.btnFooter,this.btnAciones,this.renderer);
    this.dg.actualizarAltura(Utilidades.ActualizarAlturaGrid(this.pantalla, this.container, this.btnFooter,this.dgConfig.alturaMaxima));
  }

  LPGen(value : boolean) {
    Utilidades.VerLPGenerico(value);
    return value;
  }

  traducir(key: string, def: string): string {
    let traduccion: string = this.translate.instant(key);
    if (traduccion !== key) { return traduccion; } 
    else { return def; }
  }

  //#endregion


  //#region -- web_services

  async cargarUsuarios(){
    if (this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.getListaUsuarios()).subscribe(
      (datos) => 
      {
        if (Utilidades.DatosWSCorrectos(datos)) 
        {
          // asignar valores devuletos
          this.arrayUsuarios = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayUsuarios, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayUsuarios.length>0) { this.dgConfig.actualizarConfig(true,false, 'standard',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else 
        {
          Utilidades.MostrarErrorStr(this.traducir('frm-usuario-buscar.msgErrorWS_CargarOfertas','Error web-service obtener usuarios')); 
        }
      this.WSDatos_Validando = false;
      }, (error) => {
        this.WSDatos_Validando = false;
        Utilidades.compError(error, this.router,'frm-usuario-buscar');
      }
    );
  }


  //#endregion 

  //#region -- botones de opciones principales

  salir() {
    this.location.back();
  }

  btnDetallesUsuario(){
    if(Utilidades.ObjectNull(this.dg.objSeleccionado())) {
      Utilidades.MostrarErrorStr(this.traducir('frm-usuario-buscar.msgErrorSelectLinea','Debe seleccionar una oferta'));
      return;
    }

    let vUsuario : Usuario =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-usuario-buscar', usuario: vUsuario }
    };
    this.router.navigate(['usuario'], navigationExtras);
  }


  btnNuevoUsuario() {
    alert('Ir a pantalla nuevo usuario con null -> alta nuevo registro');
    //this.router.navigate(['importar_oferta']);
  }

  //#endregion

  onDoubleClick_DataGrid(){
    // añadir codigo doble-click sobre el grid
    alert('ir a pantalla datos usuario - edicion');
    //this.verPlanificador();  
  }

  btnMostrarUsuario(index:number){
  // ICONO DEL GRID. oculto no implementado -> se usa boton Ver Detalles Usuario
  }

}
