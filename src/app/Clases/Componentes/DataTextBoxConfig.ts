

export class DataTextBoxConfig {
    constructor(_stringTxt: string, _color: string, _placeholder: string, _vCambiado: boolean, _modo: string, _validationStatus: string = 'valid', _readOnly: boolean = false) {
      this.stringTxt = _stringTxt;
      this.color = _color;
      this.placeholder = _placeholder;
      this.vCambiado = _vCambiado;
      this.modo = _modo;
      this.validationStatus = _validationStatus;
      this.readOnly = _readOnly;
    }
  
    stringTxt: string;
    color: string;
    placeholder: string;
    vCambiado: boolean;
    modo: string;
    validationStatus: string;
    readOnly: boolean;
  }