
export class DataSelectBoxConfig {
    constructor(//_stringTxt: string,  
                _dataSource: Array<any>,
                _displayExpr: string,
                _valueExpr: string,
                _color: string, 
                _placeholder: string, 
                _vCambiado: boolean,
                _label: string = '', _labelMode: string = 'static',
                //_validationStatus: string = 'valid', 
                _readOnly: boolean = false) {
      //this.stringTxt = _stringTxt;
      this.color = _color;
      this.placeholder = _placeholder;
      this.vCambiado = _vCambiado;
      //this.validationStatus = _validationStatus;
      this.readOnly = _readOnly;

      this.dataSource = _dataSource;
      this.displayExpr = _displayExpr;
      this.valueExpr = _valueExpr;
      this.label= _label;
      this.labelMode = _labelMode;
    }
  
    //stringTxt: string;
    color: string;
    placeholder: string;
    vCambiado: boolean;
    //validationStatus: string;
    readOnly: boolean;

    dataSource: Array<any>;
    displayExpr: string;
    valueExpr: string;
    label: string;
    labelMode: string;

  }