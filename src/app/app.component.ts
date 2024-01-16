import { Component, ComponentFactoryResolver, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { DxLoadPanelComponent } from 'devextreme-angular';
import { Utilidades } from './Utilidades/Utilidades';
import { environment } from '../environments/environment';

// Dictionaries for Spanish language
import esMessagges from "devextreme/localization/messages/es.json";
import { locale, loadMessages } from "devextreme/localization";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PlanificadorLayher';
  @ViewChild('container') container: ElementRef;
  @ViewChild("lpGenerico", { static: false }) LPGenerico: DxLoadPanelComponent;

  ancho = window.innerWidth;
  alto: number = window.innerHeight;

  indicatorUrl = "../assets/gifs/wifi.gif";

  constructor(private renderer: Renderer2, 
              public translate: TranslateService, 
              public resolver: ComponentFactoryResolver, 
              private titleServicio: Title) {                
    titleServicio.setTitle(environment.titulo);
    // cargar diccionarios en español
    loadMessages(esMessagges);
    locale(navigator.language || 'es');        
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.container.nativeElement, 'height', this.alto.toString() + 'px');
    Utilidades.VarStatic.LPGenerico = this.LPGenerico;
  }
  
  onResize(event) {
    this.renderer.setStyle(this.container.nativeElement, 'height', event.target.innerHeight.toString() + 'px');
  }

  onShownPanel() {
    setTimeout(() => {
      this.LPGenerico.instance.option("showIndicator", Utilidades.VarStatic.VerIconoWifi);
      this.LPGenerico.instance.option("message", Utilidades.VarStatic.VerIconoWifi ? "Conectando...": "");
    }, 6000);
  }
}
