import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AfterContentChecked } from '@angular/core';
import { CmpDataGridComponent } from '../../Componentes/cmp-data-grid/cmp-data-grid.component';
import { TipoBoton } from '../../Enumeraciones/TipoBoton';
import { ColumnDataGrid } from '../../Clases/Componentes/ColumnDataGrid';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { DataGridConfig } from '../../Clases/Componentes/DataGridConfig';
import { PlanificadorService } from '../../Servicios/PlanificadorService/planificador.service';
import { Utilidades } from '../../Utilidades/Utilidades';
import { BotonPantalla } from '../../Clases/Componentes/BotonPantalla';
import { BotonIcono } from '../../Clases/Componentes/BotonIcono';
import { DxDataGridComponent } from 'devextreme-angular';
import { element } from 'protractor';
@Component({
  selector: 'app-frm-pruebas',
  templateUrl: './frm-pruebas.component.html',
  styleUrls: ['./frm-pruebas.component.css']
})
export class FrmPruebasComponent implements OnInit, AfterViewInit, AfterContentChecked {

  constructor(public translate: TranslateService) {
  }

  ngOnInit(): void {
  }

  // para actualizar la altura de btnFooter
  ngAfterViewInit(): void {
  }

  // añadir los nombres traducidos a los botones
  ngAfterContentChecked(): void {
  }

  onResize(event) {
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

export class oArticulo {
  Articulo: string;
  Referencia: string;
  Unidades: number;
  Cliente: string;
  UnidadesMostrar: number;
  Fecha_Inicial: Date;
  Fecha_Devolucion: Date;
}

export class oUnidMostrar {
  UnidadesMostrar: number;
}