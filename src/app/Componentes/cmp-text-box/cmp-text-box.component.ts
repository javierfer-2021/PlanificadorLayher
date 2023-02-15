import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxTextBoxComponent } from 'devextreme-angular';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { DataTextBoxConfig } from '../../Clases/Componentes/DataTextBoxConfig';

@Component({
  selector: 'app-cmp-text-box',
  templateUrl: './cmp-text-box.component.html',
  styleUrls: ['./cmp-text-box.component.css']
})
export class CmpTextBoxComponent implements OnInit {

  @Input() dgConfigTxt: DataTextBoxConfig;
  @Output() onValueChanged_TextBox = new EventEmitter<any>();
  @Output() onEnterKey_TextBox = new EventEmitter<any>();
  @Output() onFocusOut_TextBox = new EventEmitter<any>();
  @Output() onFocusIn_TextBox = new EventEmitter<any>();
  
  @ViewChild('TextBox', { static: false }) TextBox: DxTextBoxComponent;

  constructor() { }

  ngOnInit(): void { }

  public onValueChanged() {
    this.dgConfigTxt.vCambiado = true;
    if (Utilidades.isEmpty(this.dgConfigTxt.stringTxt) && !Utilidades.isEmpty(this.dgConfigTxt.color)) {
      this.dgConfigTxt.color = ConfiGlobal.colorFoco;
    }
    this.onValueChanged_TextBox.emit();
  }

  public onEnterKey() {
    this.onEnterKey_TextBox.emit();
  }

  public onFocusOut() {
    if (this.dgConfigTxt.color === ConfiGlobal.colorFoco) {
      this.dgConfigTxt.color = '';
    }
    this.onFocusOut_TextBox.emit();
  }

  public onFocusIn() {
    if (Utilidades.isEmpty(this.dgConfigTxt.stringTxt)) {
      this.dgConfigTxt.color = ConfiGlobal.colorFoco;
      this.TextBox.instance.focus();
    }
    this.onFocusIn_TextBox.emit();
  }
}
