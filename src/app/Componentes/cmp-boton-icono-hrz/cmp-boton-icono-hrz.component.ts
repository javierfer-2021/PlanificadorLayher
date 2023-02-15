import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonIcono } from '../../Clases/Componentes/BotonIcono';

@Component({
  selector: 'app-cmp-boton-icono-hrz',
  templateUrl: './cmp-boton-icono-hrz.component.html',
  styleUrls: ['./cmp-boton-icono-hrz.component.css']
})
export class CmpBotonIconoHrzComponent implements OnInit, AfterViewInit {

  @Input() btnIconoHrz: BotonIcono;
  @ViewChild('botonIcono') botonIcono: ElementRef;
  @ViewChild('icono') icono: ElementRef;
  divTextoVisible = true;
  public desactivarBoton = false;

  constructor() { } 

  ngOnInit(): void {
    this.btnIconoHrz.texto = this.btnIconoHrz.texto.toUpperCase();
  }

  ngAfterViewInit(): void {
    this.divTextoVisible = Utilidades.comprobarBotonHrz(this.botonIcono, this.icono);
  }

  ejecutar() {
    this.btnIconoHrz.accion();
  }
  public DesactivarBoton(): void {
    this.desactivarBoton = true;
  }
  public ActivarBoton(): void {
    this.desactivarBoton = false;
  }


  onResize(event) {
    this.divTextoVisible = Utilidades.comprobarBotonHrz(this.botonIcono, this.icono);
  }  
}
