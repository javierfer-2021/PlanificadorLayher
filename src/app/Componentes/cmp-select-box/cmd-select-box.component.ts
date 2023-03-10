import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { DxSelectBoxComponent } from 'devextreme-angular';
import { DataSelectBoxConfig } from '../../Clases/Componentes/DataSelectBoxConfig';
import { Utilidades } from '../../Utilidades/Utilidades';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';

@Component({
  selector: 'app-cmd-select-box',
  templateUrl: './cmd-select-box.component.html',
  styleUrls: ['./cmd-select-box.component.css']
})
export class CmdSelectBoxComponent implements OnInit {

  @Input() dgConfigSB: DataSelectBoxConfig;
  @Output() onValueChanged_SelectBox = new EventEmitter<any>();
  @Output() onEnterKey_SelectBox = new EventEmitter<any>();
  @Output() onFocusOut_SelectBox = new EventEmitter<any>();
  @Output() onFocusIn_SelectBox = new EventEmitter<any>();
  
  @ViewChild('SelectBox', { static: false }) SelectBox: DxSelectBoxComponent;

  constructor() { }

  ngOnInit(): void {
  }

  public onValueChanged() {
    this.dgConfigSB.vCambiado = true;
    // if (Utilidades.isEmpty(this.dgConfigSB.stringTxt) && !Utilidades.isEmpty(this.dgConfigSB.color)) {
    //   this.dgConfigSB.color = ConfiGlobal.colorFoco;
    // }
    this.onValueChanged_SelectBox.emit();
  }

  public onEnterKey() {
    this.onEnterKey_SelectBox.emit();
  }

  public onFocusOut() {
    if (this.dgConfigSB.color === ConfiGlobal.colorFoco) {
      this.dgConfigSB.color = '';
    }
    this.onFocusOut_SelectBox.emit();
  }

  public onFocusIn() {
    // if (Utilidades.isEmpty(this.dgConfigSB.stringTxt)) {
    //   this.dgConfigSB.color = ConfiGlobal.colorFoco;
    //   this.SelectBox.instance.focus();
    // }
    this.onFocusIn_SelectBox.emit();
  }


}
