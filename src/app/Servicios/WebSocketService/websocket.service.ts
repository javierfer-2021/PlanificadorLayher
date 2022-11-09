import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { AnonymousSubject,Subject } from 'rxjs/internal/Subject';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TiposGruposWS } from '../../Enumeraciones/TiposGruposWS';

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

  private subject!: AnonymousSubject<MessageEvent>;
  public messages: Subject<Message_WS>;
  private CHAT_URL = 'ws://' + ConfiGlobal.WebSocket_IP + ':' + ConfiGlobal.WebSocket_PORT;
  // private CHAT_URL = 'ws://192.168.10.129:707';
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

    if (!this.subject) {
      this.subject = this.create(this.CHAT_URL);
  
      if(enviarUsuario){
        this.EnviarUsuario();
        console.log('Usuario enviado');
      }

      console.log(this.subject);
    }
    return this.subject;
  }

  private create(url: any): AnonymousSubject<MessageEvent> {
    this.ws = new WebSocket(url);
    
    this.ws.addEventListener('close', async (event) => {
      try {
        console.log('disconnected');
        console.log(this.ws.readyState);
        this.Conectado = false;
        // this.disconnect();
  
        // while de conectar
        let inicio = new Date().getTime()

        // while (!this.Conectado && (new Date().getTime() - inicio) < ConfiGlobal.HttpTimeWait){
        // while (ConfiGlobal.WebSocket_Enabled && !this.Conectado && (new Date().getTime() - inicio) < 12000){
        //   console.log('intentando reconectar');
        //   await Utilidades.delay(2500);
        //   Utilidades.init_WS();
        // }

        // this.ws.removeEventListener('close', (event) => {
        //   console.log('evento close eliminado'); 
        // });
      } catch { }
      
    });

    this.ws.addEventListener('message', (event) => {
      console.log('message received');
      let jsonDatos: any = JSON.parse(event.data);

      if(jsonDatos.Grupo === TiposGruposWS.Close) {
        try { 
          Utilidades.navegarLogin();
          ConfiGlobal.Token = '';
          ConfiGlobal.Usuario = 0;

          // Se desconecta la conexión con el servidor websocket
          Utilidades.WebsocketService.disconnect();
          // Solo cuando se cierra sesión se pone a false y luego en el login se recibe de la bbdd
          ConfiGlobal.WebSocket_Enabled = false;
        } catch { }
      }

      if(jsonDatos.Grupo === TiposGruposWS.Notificacion) {
        Utilidades.MostrarErrorStr(jsonDatos.Datos + ' Pr', 'info', 4000);
        let date = Utilidades.getFechaHoraActual();
        console.log(date + ' --- ' + jsonDatos.Datos + ' Pr', 'info', 4000);
      }
    });

    this.ws.addEventListener('open', (event) => {
      console.log('open');
      console.log(this.ws.readyState);
      this.Conectado = true;
    });

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

  private async EnviarUsuario(){
    let message: Message_WS = {
      Grupo: 1,
      Datos: "AssignUserID;" + ConfiGlobal.Usuario.toString()
    };

    while (this.ws.readyState !== WebSocket.OPEN) {
      await Utilidades.delay(100);
    }

    try {
      this.ws.send(JSON.stringify(message));
    } catch { }
  }

  public disconnect() {
    try {
      this.ws.close();
    } catch { }
    this.subject = null;
  }
}
