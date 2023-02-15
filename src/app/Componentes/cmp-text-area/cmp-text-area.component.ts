import { Component, Input, OnInit } from '@angular/core';
import { DataTextAreaConfig } from '../../Clases/Componentes/DataTextAreaConfig';

@Component({
  selector: 'app-cmp-text-area',
  templateUrl: './cmp-text-area.component.html',
  styleUrls: ['./cmp-text-area.component.css']
})
export class CmpTextAreaComponent implements OnInit {

  @Input() taConfig: DataTextAreaConfig;

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
