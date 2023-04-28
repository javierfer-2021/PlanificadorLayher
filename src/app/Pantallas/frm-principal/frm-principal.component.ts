import { Component, OnInit, ComponentFactoryResolver, AfterViewInit, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BotonMenu } from '../../Clases/Componentes/BotonMenu';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { PeticionesGeneralesService } from 'src/app/Servicios/PeticionesGeneralesService/peticiones-generales.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { TiposGruposWS } from '../../Enumeraciones/TiposGruposWS';
import { Usuario } from '../../Clases/Usuario';

@Component({
  selector: 'app-frm-principal',
  templateUrl: './frm-principal.component.html',
  styleUrls: ['./frm-principal.component.css']
})
export class FrmPrincipalComponent implements OnInit, AfterViewInit {
  
  loadingPrincipalVisible: boolean = false;
  version: string = ConfiGlobal.version;
  nombreUsuario: string = ConfiGlobal.NombreUsuario;
  _usuario: Usuario = new Usuario();
  

  WSGetInci_Validando: boolean = false;
  WSGetInci_Valido: boolean = false;
 
  botonComprasBuscar: BotonMenu = { icono: './assets/icons/entradas.svg', texto: 'Buscar y Ver Entradas', ruta: '', nombre: 'botonComprasBuscar', notificacion: 0, desactivado: false, accion: () => { } };
  botonComprasImportar: BotonMenu = { icono: './assets/icons/importar.svg', texto: 'Importar Entrada', ruta: '', nombre: 'botonComprasImportar', notificacion: 0, desactivado: false, accion: () => { } };

  botonVentaBuscar: BotonMenu = { icono: './assets/icons/salidas.svg', texto: 'Buscar y Ver Salidas', ruta: '', nombre: 'botonVentaBuscar', notificacion: 0, desactivado: false, accion: () => { } };
  botonVentaImportar: BotonMenu = { icono: './assets/icons/importar.svg', texto: 'Importar Salida', ruta: '', nombre: 'botonVentaImportar', notificacion: 0, desactivado: false, accion: () => { } };
  
  botonIncidencias: BotonMenu = { icono: './assets/icons/atencion.svg', texto: 'Gestión Incidencias', ruta: '', nombre: 'botonIncidencias', notificacion: 0, desactivado: false, accion: () => { } };
  
  botonStock: BotonMenu = { icono: './assets/icons/stock.svg', texto: 'Ver Articulos-Stock', ruta: '', nombre: 'botonStock', notificacion: 0, desactivado: false, accion: () => { } };
  
  botonUsuarios: BotonMenu = { icono: './assets/icons/usuario.svg', texto: 'Gestión Usuarios', ruta: '', nombre: 'botonUsuarios', notificacion: 0, desactivado: false, accion: () => { } };
  botonConfiguracion: BotonMenu = { icono: './assets/icons/configuracion.svg', texto: 'Configuración', ruta: '', nombre: 'botonConfiguracion', notificacion: 0, desactivado: false, accion: () => { } };
  botonIniciarPeriodo: BotonMenu = { icono: './assets/icons/servidor-web.svg', texto: 'Iniciar Ejercicio y Gestión Maestros', ruta: '', nombre: 'botonIniciarPeriodo', notificacion: 0, desactivado: false, accion: () => { } };
  
  btnAciones: BotonPantalla[] =  [
    { icono :'', texto: this.traducir('frm-principal.btnSalir', 'Salir'), posicion: 1, accion: () => {this.cerrarSesion();}, tipo: TipoBoton.danger, activo: true, visible: true } 
  ];

  constructor(private router: Router,
              public peticionesService: PeticionesGeneralesService,
              public translate: TranslateService,
              public resolver: ComponentFactoryResolver,
  ) {

    Utilidades.CompActual = this;

    this.Reconectar();

    this.botonVentaBuscar.accion = () => { this.router.navigate(['venta_buscar']); };
    this.botonVentaImportar.accion = () => { this.router.navigate(['venta_importar']); };
    this.botonComprasBuscar.accion = () => { this.router.navigate(['compra_buscar']); };
    this.botonComprasImportar.accion = () => { this.router.navigate(['compra_importar']); };
    this.botonIncidencias.accion = () => { this.router.navigate(['incidencia-buscar']); };
    this.botonStock.accion = () => { this.router.navigate(['articulos_stock']); };
    this.botonUsuarios.accion = () => { this.router.navigate(['usuario_buscar']); };
    this.botonConfiguracion.accion = () => { this.router.navigate(['configuracion']); };
    this.botonIniciarPeriodo.accion = () => { this.router.navigate(['importar_maestros']); };
    
    this.loadingPrincipalVisible = Utilidades.VarStatic.LoadPrincipal;
    this._usuario = ConfiGlobal.DatosUsuario;
  }

  async ngOnInit(): Promise<void> {    
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
  }

  ngAfterViewInit(): void {
    Utilidades.VarStatic.Filtros = null;
    ConfiGlobal.lbl_NoHayDatos = this.traducir('aplicacion.Lbl_NoHayDatos','No hay datos');
  }

  cerrarSesion(){
    setTimeout(() => { // setTimeout porque al darle dos veces rapido a cerrarSesion, no detecta que esta a true y salta error
      if (this.WSGetInci_Validando) return;
      if(this.WSGetInci_Valido) return;

      this.WSGetInci_Validando = true;
      this.peticionesService.cerrarSesion().subscribe(
        datos => {
          this.WSGetInci_Validando = false;
          setTimeout(() => {
            this.router.navigate(['']);
            ConfiGlobal.Token = '';
            ConfiGlobal.Usuario = 0;
            if (datos.mensaje === 'el usuario introducido no está logueado en el sistema'){
              Utilidades.MostrarErrorStr('Error', 'error', 3000);
              // notify('Error', 'error', 3000);
            }
          }, 100);
        },
        error => {
          this.WSGetInci_Validando = false;
          Utilidades.compError(error, this.router, 'frm-principal');
        }
      );
    }, 100);

    try { 
      // Se desconecta la conexión con el servidor websocket
      Utilidades.WebsocketService.disconnect();
      // Solo cuando se cierra sesión se pone a false y luego en el login se recibe de la bbdd
      ConfiGlobal.WebSocket_Enabled = false;
    } catch { }
  }

  public Reconectar(): void{
    try {
      Utilidades.init_WS().messages.subscribe(msg => {
        if(msg.Grupo === TiposGruposWS.Notificacion) {
          Utilidades.MostrarErrorStr(msg.Datos + ' Pr', 'info', 4000);
        } else if(msg.Grupo === TiposGruposWS.Individual) {
          Utilidades.WebsocketService.Reconectar = false;
          // this.router.navigate(['']);
          window.location.reload();
        }
      });
    } catch { }
  }

  wsConectado() {
    return Utilidades.WebsocketService.Conectado;
  }

  wsComprobando() {
    return Utilidades.WebsocketService.Comprobando;
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
}
