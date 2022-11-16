import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnonymousSubject,Subject } from 'rxjs/internal/Subject';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TiposGruposWS } from '../../Enumeraciones/TiposGruposWS';
import { TiposDesconexionWS } from '../../Enumeraciones/TiposDesconexionWS';

export interface Message_WS {
  Grupo: number;
  Datos: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public Conectado: boolean = true;
  public Reconectar: boolean = true;
  public Comprobando: boolean = false;

  private subject!: AnonymousSubject<MessageEvent>;
  public messages: Subject<Message_WS>;
  private CHAT_URL = 'ws://' + ConfiGlobal.WebSocket_IP + ':' + ConfiGlobal.WebSocket_PORT;
  public ws: WebSocket;

  constructor() {
    if(!ConfiGlobal.WebSocket_Enabled) return;

    this.messages = <Subject<Message_WS>>this.connect().pipe(
      map(
        (response: MessageEvent): Message_WS => {
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );
  }

  public connect(enviarUsuario: boolean = true): AnonymousSubject<MessageEvent> {
    if(!ConfiGlobal.WebSocket_Enabled) return;

    
    // PRUEBAS
    // let estado: boolean = false;
    // if(estado) {
    //   if(!Utilidades.isEmpty(this.subject)) {
    //     this.reconectando = true;
    //   }

    //   this.subject = this.create(this.CHAT_URL);

    //   if(enviarUsuario){
    //     this.EnviarUsuario();
    //   }

    //   console.log(this.subject);

    //   return this.subject;
    // }

    if (!this.subject || this.ws.readyState === this.ws.CLOSED) {
      if(!Utilidades.isEmpty(this.subject)) {
        this.reconectando = true;
      }

      this.subject = this.create(this.CHAT_URL);

      if(enviarUsuario){
        this.EnviarUsuario();
      }

      console.log(this.subject);
    }
    return this.subject;
  }

  Open = (event) => {
    console.log('open');
    console.log(this.ws.readyState);
    this.Conectado = true;
    this.flagNoConn = false;

  }


  flagNoConn: boolean = false;
  reconectando: boolean = false;

  Close = async (event) => {
    console.log(event);
    // console.log('99 Code: '+ event.code);
    // console.log('99 wasClean: ' + event.wasClean);
    // if(event.code !== 1005) return;
    if(this.flagNoConn) return;
    console.log('Cerrando: ' + this.reconectando);
    if(this.reconectando) {
      this.reconectando = false;
      return;
    }

    if(Utilidades.WebsocketService.ws.readyState === Utilidades.WebsocketService.ws.OPEN) {
      console.log('Close open');
      return;
    } 

    try {
      let str = Utilidades.generarId();
      console.log('disconnected');
      console.log(this.ws.readyState);
      this.Conectado = false;
      this.UserEnviado = false;
      // this.subject = null;
      // this.disconnect();

      // while de conectar
      // let inicio = new Date().getTime()
      let intentos: number = 1;
      // while (!this.Conectado && (new Date().getTime() - inicio) < ConfiGlobal.HttpTimeWait){
      while (ConfiGlobal.WebSocket_Enabled && !this.Conectado && intentos < 10) {//(new Date().getTime() - inicio) < 12000){
        this.Comprobando = true;
        console.log(`99 intentando reconectar: ${intentos}, ID: ${str}`);
        await Utilidades.delay(2500);
        // Utilidades.init_WS();
        // if(!Utilidades.isEmpty(Utilidades.CompActual))
        Utilidades.CompActual.Reconectar();
        this.flagNoConn = true;

        intentos++;
      }
      this.Comprobando = false;

    } catch { }
  }

  Message = (event) => {
    console.log('message received');
    let jsonDatos: any = JSON.parse(event.data);

    if(jsonDatos.Grupo === TiposGruposWS.Close) {
      try { 
        if(jsonDatos.Datos.TipoDesconexionWS === TiposDesconexionWS.LoginOtroEquipo) {
          Utilidades.navegarLogin();
          Utilidades.MostrarErrorStr('Se ha iniciado sesión desde otro dispositivo', 'warning', 4000);
          ConfiGlobal.Token = '';
          ConfiGlobal.Usuario = 0;
  
          // Se desconecta la conexión con el servidor websocket
          Utilidades.WebsocketService.disconnect();
          // Solo cuando se cierra sesión se pone a false y luego en el login se recibe de la bbdd
          ConfiGlobal.WebSocket_Enabled = false;
        } else if(jsonDatos.Datos.TipoDesconexionWS === TiposDesconexionWS.Reconectar) {
          this.reconectando = false; 
        }
      } catch { }
    }

    if(jsonDatos.Grupo === TiposGruposWS.Notificacion) {
      Utilidades.MostrarErrorStr(jsonDatos.Datos + ' Pr', 'info', 4000);
      let date = Utilidades.getFechaHoraActual();
      console.log(date + ' --- ' + jsonDatos.Datos + ' Pr', 'info', 4000);
    }
  }

  private create(url: any): AnonymousSubject<MessageEvent> {
    this.ws = new WebSocket(url);
    
    // try {
    //   this.ws.removeEventListener('open', this.Open);
    //   this.ws.removeEventListener('close', this.Close);
    //   this.ws.removeEventListener('message', this.Message);
    // } catch {
    //   console.log('error al removeeventlistener');
    // }


    this.ws.addEventListener('open', this.Open);
    this.ws.addEventListener('close', this.Close);
    this.ws.addEventListener('message', this.Message);

    this.ws.addEventListener('error', function (event) {
      console.log('error');
    });

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      this.ws.onmessage = obs.next.bind(obs);
      this.ws.onerror = obs.error.bind(obs);
      this.ws.onclose = obs.complete.bind(obs);
      return this.ws.close.bind(this.ws);
    });

    let observer: any = {
      error: (err: Object) => { console.log(err) },
      complete: (comp: Object) => { console.log(comp) },
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

  UserEnviado: boolean = false;

  private async EnviarUsuario(){
    this.UserEnviado = false;

    console.log('Usuario enviando');
    let message: Message_WS = {
      Grupo: 1,
      Datos: "AssignUserID;" + ConfiGlobal.Usuario.toString()
    };

    while (this.ws.readyState !== WebSocket.OPEN) {
      await Utilidades.delay(100);
      if(this.UserEnviado) return;
    }

    try {
      this.ws.send(JSON.stringify(message));
      this.UserEnviado = true;
      console.log('usuario enviado');
    } catch { console.log('usuario NO enviado'); }
  }

  public disconnect() {
    try {
      this.ws.close();
    } catch { }
    this.subject = null;
  }
}