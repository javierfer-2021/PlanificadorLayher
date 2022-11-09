import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, AfterContentChecked, Input } from '@angular/core';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cmp-info-grid',
  templateUrl: './cmp-info-grid.component.html',
  styleUrls: ['./cmp-info-grid.component.css']
})
export class CmpInfoGridComponent implements OnInit, AfterViewInit, AfterContentChecked  {
  altoBtnFooter = '45px';
  @ViewChild('container') container: ElementRef;
  @ViewChild('btnFooter') btnFooter: ElementRef;
  @ViewChild('pantalla') pantalla: ElementRef;

  @Input() infoArticulo;

  loadingVisible = false;

  constructor(private renderer: Renderer2,
              private location: Location,
              private router: Router,
              public translate: TranslateService) { }

  ngOnInit(): void { 
    document.getElementById('info').innerHTML = this.infoArticulo;
  }

  // para actualizar la altura de btnFooter
  ngAfterViewInit(): void { }

  // añadir los nombres traducidos a los botones
  ngAfterContentChecked(): void { }

  traducir(key: string, def: string): string {
    let traduccion: string = this.translate.instant(key);
    if (traduccion !== key) {
      return traduccion;
    } else {
      return def;
    }
  }


}
