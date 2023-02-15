import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonIcono } from '../../Clases/Componentes/BotonIcono';

@Component({
  selector: 'app-cmp-boton-icono-vert',
  templateUrl: './cmp-boton-icono-vert.component.html',
  styleUrls: ['./cmp-boton-icono-vert.component.css']
})
export class CmpBotonIconoVertComponent implements OnInit, AfterViewInit {
  @Input() btnIconoVert: BotonIcono;
  @ViewChild('botonIcono') botonIcono: ElementRef;
  @ViewChild('icono') icono: ElementRef;
  @ViewChild('texto') texto: ElementRef;
  divTextoVisible = true;

  constructor() { } 

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if(Utilidades.comprobarBotonVert(this.botonIcono, this.icono, this.texto, this.btnIconoVert.nroFilas)) {
      this.divTextoVisible = true;
    } else if (!Utilidades.comprobarBotonVert(this.botonIcono, this.icono, this.texto, this.btnIconoVert.nroFilas)) {
      this.divTextoVisible = false;
    }
    // this.comprobarBoton();
  }

  ejecutar() {
    this.btnIconoVert.accion();
  }

  onResize(event) {
    if(Utilidades.comprobarBotonVert(this.botonIcono, this.icono, this.texto, this.btnIconoVert.nroFilas)) {
      this.divTextoVisible = true;
    } else if (!Utilidades.comprobarBotonVert(this.botonIcono, this.icono, this.texto, this.btnIconoVert.nroFilas)) {
      this.divTextoVisible = false;
    }
  } 

}
