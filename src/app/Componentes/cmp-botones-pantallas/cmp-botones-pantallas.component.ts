import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';

@Component({
  selector: 'app-cmp-botones-pantallas',
  templateUrl: './cmp-botones-pantallas.component.html',
  styleUrls: ['./cmp-botones-pantallas.component.css']
})
export class CmpBotonesPantallasComponent implements OnInit, AfterViewInit {

  altoMinBotonesXS: number = ConfiGlobal.altoMinBotonesXS;

  @Input() botones: BotonPantalla[];
  @Input() tamAlto: string;

  btn1: BotonPantalla = new BotonPantalla();
  btn2: BotonPantalla = new BotonPantalla();
  btn3: BotonPantalla = new BotonPantalla();
  btn4: BotonPantalla = new BotonPantalla();

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    for(let c = 0; c < this.botones.length; c++){
      if (this.botones[c].posicion == 1)
      {
        this.btn1.visible = (this.botones[c].visible === undefined) ? true: this.botones[c].visible;
        this.btn1.activo = true;
        continue;
      }
      if (this.botones[c].posicion == 2)
      {
        this.btn2.visible = (this.botones[c].visible === undefined) ? true: this.botones[c].visible;
        this.btn2.activo = (this.botones[c].activo === undefined) ? true: this.botones[c].activo;
        continue;
      }
      if (this.botones[c].posicion == 3)
      {
        this.btn3.visible = (this.botones[c].visible === undefined) ? true: this.botones[c].visible;
        this.btn3.activo = (this.botones[c].activo === undefined) ? true: this.botones[c].activo;
        continue;
      }
      if (this.botones[c].posicion == 4)
      {
        this.btn4.visible = (this.botones[c].visible === undefined) ? true: this.botones[c].visible;
        this.btn4.activo = (this.botones[c].activo === undefined) ? true: this.botones[c].activo;
        continue;
      }
    }
  }

  mostrar(pos: number): boolean {
    const btn = this.botones.find(b => b.posicion === pos);
    if (btn === undefined) {
      return false;
    }
    switch (pos) {
      case 1:
        this.btn1 = btn;
        break;
      case 2:
        this.btn2 = btn;
        break;
      case 3:
        this.btn3 = btn;
        break;
      case 4:
        this.btn4 = btn;
        break;
    }
    return true;
  }

  VisibleBtn(pos: number): boolean  {
    const btn = this.botones.find(b => b.posicion === pos);
    if (btn === undefined) {
      return false;
    }
    switch (pos) {
      case 1:
        return this.btn1.visible;
      case 2:
        return this.btn2.visible;
      case 3:
        return this.btn3.visible;
      case 4:
        return this.btn4.visible;
    }
    return true;
  }

  /**
   * Sirve para actualizar los botones 
   */
  public ActualizarBtn(_btn: BotonPantalla)
  {
    const btn = this.botones.find(b => b.posicion === _btn.posicion);
    if (btn === undefined) {
      return;
    }
    switch (_btn.posicion) {
      case 1:
        this.btn1 = _btn;
        break;
      case 2:
        this.btn2 = _btn;
        break;
      case 3:
        this.btn3 = _btn;
        break;
      case 4:
        this.btn4 = _btn;
        break;
    }
    return;
  }


  ejecutarClick_1() {
    this.btn1.accion();
  }

  ejecutarClick_2() {
    this.btn2.accion();
  }

  ejecutarClick_3() {
    this.btn3.accion();
  }

  ejecutarClick_4() {
    this.btn4.accion();
  }

  public focusButton(query) {
    try {
      let div: HTMLElement = document.getElementById(query);
      setTimeout(() => {
        div.focus();
      }, 150);
    } catch {
      
    }
  }

}
