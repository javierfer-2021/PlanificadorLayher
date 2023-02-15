import { Pantalla } from "../../Enumeraciones/Pantalla";
import { TiposTamPantalla } from "../../Enumeraciones/TiposTamPantalla";
import { ElementRef } from "@angular/core";

export class DataScrollAreaConfig {
    constructor(_height: number, _texto: string, _pantalla?: ElementRef,_contenedor?: ElementRef) {
      this.alturaMaxima = _height;
      this.texto = _texto;
  
      let tipoPantalla: Pantalla = this.reconocerPantalla();
  
      if (tipoPantalla === Pantalla.XS && _pantalla !== undefined) {
        const altoPantalla = _pantalla.nativeElement.offsetHeight;
        const altoContenedor = _contenedor.nativeElement.offsetHeight;
        const diff = altoContenedor - altoPantalla;
        this.alturaMaxima += diff;
      }
    }
  
    alturaMaxima: number;
    texto: string;
  
    private reconocerPantalla(): Pantalla {
      if (window.innerWidth <= TiposTamPantalla.SM_MIN) {
          return Pantalla.XS;
      }
      else if (window.innerWidth > TiposTamPantalla.SM_MIN && window.innerWidth <= TiposTamPantalla.MD_MIN) {
          return Pantalla.SM;
      }
      else if (window.innerWidth > TiposTamPantalla.MD_MIN && window.innerWidth <= TiposTamPantalla.LG_MIN) {
          return Pantalla.MD;
      }
      else if (window.innerWidth > TiposTamPantalla.LG_MIN && window.innerWidth <= TiposTamPantalla.XL_MIN) {
          return Pantalla.LG;
      }
      else if (window.innerWidth > TiposTamPantalla.XL_MIN) {
          return Pantalla.XL;
      }
    }
  }