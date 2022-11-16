import { Component, OnInit, ComponentFactoryResolver, AfterViewInit, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { BotonMenu } from '../../Clases/BotonMenu';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { BotonPantalla } from '../../Clases/BotonPantalla';
import { PeticionesGeneralesService } from 'src/app/Servicios/PeticionesGeneralesService/peticiones-generales.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { TiposGruposWS } from '../../Enumeraciones/TiposGruposWS';

@Component({
  selector: 'app-frm-principal',
  templateUrl: './frm-principal.component.html',
  styleUrls: ['./frm-principal.component.css']
})
export class FrmPrincipalComponent implements OnInit, AfterViewInit {
  // botonPlanificador: BotonMenu =
  //   { icono: './assets/icons/Analizar_Lectura A_B.svg', texto: 'Planificador', ruta: '', nombre: 'botonPlanificador', notificacion: 0, desactivado: ConfiGlobal.disRecepcion, accion: () => { } };
  // botonPruebas: BotonMenu =
  //   { icono: './assets/icons/Mas A_B.svg', texto: 'Pruebas', ruta: '', nombre: 'botonPruebas', notificacion: 0, desactivado: ConfiGlobal.disPicking, accion: () => { } };
  
  botonPlanificador: BotonMenu =
    { icono: './assets/icons/Analizar_Lectura A_B.svg', texto: 'Planificador', ruta: '', nombre: 'botonPlanificador', notificacion: 0, desactivado: false, accion: () => { } };
  botonPruebas: BotonMenu =
    { icono: './assets/icons/Mas A_B.svg', texto: 'Pruebas', ruta: '', nombre: 'botonPruebas', notificacion: 0, desactivado: false, accion: () => { } };
  

  version: string = ConfiGlobal.version;
  nombreUsuario: string = ConfiGlobal.NombreUsuario;

  WSGetInci_Validando: boolean = false;
  WSGetInci_Valido: boolean = false;

  loadingPrincipalVisible: boolean = false;

  btnAciones: BotonPantalla[] =
  [
    { icono: '', texto: 'Salir', posicion: 1, accion: () => { }, tipo: TipoBoton.danger, activo: true, visible: true }
  ];

  constructor(private router: Router,
              public peticionesService: PeticionesGeneralesService,
              public translate: TranslateService,
              public resolver: ComponentFactoryResolver,
  ) {

    Utilidades.CompActual = this;

    this.Reconectar();

    this.botonPlanificador.accion = () => {
      this.router.navigate(['planificador']);
    };
    this.botonPruebas.accion = () => {
      this.router.navigate(['pruebas']);
    };

    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.accion = () => {
          this.cerrarSesion();
        };
      }
    });

    this.loadingPrincipalVisible = Utilidades.VarStatic.LoadPrincipal;
  }

  async ngOnInit(): Promise<void> {    
    // if (this.WSGetInci_Validando) return;
    // if(this.WSGetInci_Valido) return;

    // this.WSGetInci_Validando = true;
    // ConfiGlobal.principalValidando = true;
    // (await this.peticionesService.getTareasPendientes()).subscribe(
    //   datos => {
    //     if (Utilidades.DatosWSCorrectos(datos)) {
    //       // Solo muestra las tareas pendientes si tiene y si el boton esta habilitado
    //       if (!(datos.datos.PLANIFICADOR === '0') && !this.botonPlanificador.desactivado){
    //         this.botonPlanificador.notificacion = datos.datos.RECEPCION;
    //       }
    //       this.WSGetInci_Validando = false;
    //       ConfiGlobal.principalValidando = false;
    //     }
    //   },
    //   error => {
    //     this.WSGetInci_Validando = false;
    //     Utilidades.compError(error, this.router, 'frm-principal');
    //   }
    // );
  }

  ngAfterContentChecked(): void {
    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    this.btnAciones.forEach((a, b, c) => {
      if (a.posicion === 1) {
        a.texto = this.traducir('frm-principal.btnSalir', 'Salir');
      }
    });
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
