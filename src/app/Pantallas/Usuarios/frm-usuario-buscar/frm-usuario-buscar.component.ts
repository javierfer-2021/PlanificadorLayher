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
  // [IdUsuario,Login,Password,NombreUsuario,FechaAlta,FechaBaja,Baja,Email,Conectado,IdIdioma,NombreIdioma,Skin,Administrador,idAlmacenDefecto,NombreAlmacenDefecto,VerAlmacenes]
  arrayUsuarios: Array<Usuario>;
  cols: Array<ColumnDataGrid> = [
    {
      dataField: '',
      caption: '',
      visible: true,
      type: "buttons",
      width: 95,
      //alignment: "center",
      fixed: true,
      fixedPosition: "right",
      buttons: [ 
        { icon: "info",
          hint: "Ver detalles usuario",
          onClick: (e) => { 
            this.btnMostrarUsuario(e); 
          }
        },
        // { icon: "edit",
        //   hint: "Editar usuario",
        //   onClick: (e) => { 
        //     this.btnMostrarUsuario(e.row.rowIndex); 
        //   }
        // },   
        { icon: "trash",
          hint: "Eliminar usuario",
          onClick: (e) => { 
            this.btnEliminarUsuario(e); 
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
      dataField: 'Login',
      caption: this.traducir('frm-usuario-buscar.colLogin','Login'),
      visible: true,      
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
      dataField: 'idAlmacenDefecto',
      caption: this.traducir('frm-usuario-buscar.colIdAlmacenDefecto','Id.Almacen'),
      visible: false,      
    },
    {
      dataField: 'NombreAlmacenDefecto',
      caption: this.traducir('frm-usuario-buscar.colNombreAlmacenDefecto','Almacen Def.'),
      visible: true,
    }, 
    {
      dataField: 'FechaAlta',
      caption: this.traducir('frm-usuario-buscar.colFechaAlta','Fecha Alta'),
      visible: false,
      dataType: 'date',
    },
    {
      dataField: 'FechaBaja',
      caption: this.traducir('frm-usuario-buscar.colFechaBaja','Fecha Baja'),
      visible: false,
      dataType: 'date',
    },
    {
      dataField: 'Activo',
      caption: this.traducir('frm-usuario-buscar.colActivo','Activo'),
      visible: true,
      dataType: 'boolean',
    },                    
    {
      dataField: 'Administrador',
      caption: this.traducir('frm-usuario-buscar.colAdministrador','Administrador'),
      visible: true,
      dataType: 'boolean',
    },  
    {
      dataField: 'VerAlmacenes',
      caption: this.traducir('frm-usuario-buscar.colVerAlmacenes','Ver Almacenes'),
      visible: true,
      dataType: 'boolean',
    },  
    {
      dataField: 'Email',
      caption: this.traducir('frm-usuario-buscar.colEmail','Email'),
      visible: false,
    },        
    {
      dataField: 'Conectado',
      caption: this.traducir('frm-usuario-buscar.colConectado','Conectado'),
      visible: false,
      dataType: 'boolean',
    },
    {
      dataField: 'Skin',
      caption: this.traducir('frm-usuario-buscar.colSkin','Skin'),
      visible: false,
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


  async eliminarUsuarios(idUser:number){
    if (this.WSDatos_Validando) return;

    this.WSDatos_Validando = true;
    (await this.planificadorService.eliminarUsuario(idUser)).subscribe(
      (datos) => 
      {
        if (Utilidades.DatosWSCorrectos(datos)) 
        {
          // asignar valores devuletos (lista usuarios actualizada)
          this.arrayUsuarios = datos.datos;
          this.dgConfig = new DataGridConfig(this.arrayUsuarios, this.cols, this.dgConfig.alturaMaxima, ConfiGlobal.lbl_NoHayDatos);
          if (this.arrayUsuarios.length>0) { this.dgConfig.actualizarConfig(true,false, 'standard',true, true);}
          else { this.dgConfig.actualizarConfig(true,false, 'standard'); }
        }
        else 
        {
          Utilidades.MostrarErrorStr(this.traducir('frm-usuario-buscar.msgErrorWS_EliminarUsuario','Error web-service eliminar usuarios')); 
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
      Utilidades.MostrarErrorStr(this.traducir('frm-usuario-buscar.msgErrorSelectLinea','Debe seleccionar un usuario'));
      return;
    }

    let vUsuario : Usuario =  this.dg.objSeleccionado();    
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-usuario-buscar', usuario: vUsuario }
    };
    this.router.navigate(['usuario'], navigationExtras);
  }


  btnNuevoUsuario() {
    const navigationExtras: NavigationExtras = {
      state: { PantallaAnterior: 'frm-usuario-buscar', usuario: null }
    };
    this.router.navigate(['usuario'], navigationExtras);    
  }

  //#endregion

  onDoubleClick_DataGrid(){
    this.btnDetallesUsuario(); 
  }

  btnMostrarUsuario(e:any){
    this.dg.seleccionarFila(e.row.data.IdUsuario,'IdUsuario');
    this.btnDetallesUsuario();
  }

  async btnEliminarUsuario(e:any){
    this.dg.seleccionarFila(e.row.data.IdUsuario,'IdUsuario');
    let continuar = <boolean>await Utilidades.ShowDialogString(this.traducir('frm-usuario-buscar.MsgEliminarUsuario', 'El Usuario '+e.row.data.NombreUsuario+' sera eliminado de la planificación.'+'<br>¿Esta seguro que desea Continuar?'), this.traducir('frm-usuario-buscar.TituloEliminar', 'Eliminar Usuario'));  
    if (!continuar) return;
    else {
      this.eliminarUsuarios(e.row.data.IdUsuario);
    }
  }
  

}
