import { Component, OnInit, Input } from '@angular/core';
import { DataScrollAreaConfig } from '../../Clases/Componentes/DataScrollAreaConfig';

@Component({
  selector: 'app-cmp-scroll-area',
  templateUrl: './cmp-scroll-area.component.html',
  styleUrls: ['./cmp-scroll-area.component.css']
})
export class CmpScrollAreaComponent implements OnInit {

  @Input() taConfig: DataScrollAreaConfig;

  constructor() { }

  ngOnInit(): void {
  }

  public actualizarAltura(altura: number): void {
    this.taConfig.alturaMaxima = altura;
  }

  public actualizarTexto(texto: string): void {
    this.taConfig.texto = texto;
  }  

}
