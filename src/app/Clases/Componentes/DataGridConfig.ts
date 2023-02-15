import { ColumnDataGrid } from "./ColumnDataGrid";
import { Pantalla } from "../../Enumeraciones/Pantalla";
import { TiposTamPantalla } from "../../Enumeraciones/TiposTamPantalla";

import { ElementRef } from "@angular/core";

export class DataGridConfig {
    disabled: boolean;
    constructor(_dataSource: Array<any>, _columnas: Array<ColumnDataGrid> = [], _alturaMaxima: number
      , _txtDatosVacios: string, _pantalla?: ElementRef,_contenedor?: ElementRef, _filterRowVisible: boolean = false
      , _disabled: boolean = false ) {
      this.dataSource = _dataSource;
      this.columnas = _columnas;
      this.alturaMaxima = _alturaMaxima;
      this.txtDatosVacios = _txtDatosVacios;
      this.filterRowVisible = _filterRowVisible;
      this.disabled = _disabled;
  
      let tipoPantalla: Pantalla = this.reconocerPantalla();
  
      if (tipoPantalla === Pantalla.XS && _pantalla !== undefined) {
        const altoPantalla = _pantalla.nativeElement.offsetHeight;
        const altoContenedor = _contenedor.nativeElement.offsetHeight;
        const diff = altoContenedor - altoPantalla;
        this.alturaMaxima += diff;
      }
    }
    
    
    private reconocerPantalla(): Pantalla {
      if (window.innerWidth <= TiposTamPantalla.SM_MIN) {
          return Pantalla.XS;
      }
      else if (window.innerWidth > TiposTamPantalla.SM_MIN && window.innerWidth <= TiposTamPantalla.MD_MIN) {
          return Pantalla.SM;
      }
      else if (window.innerWidth > TiposTamPantalla.MD_MIN && window.innerWidth <= TiposTamPantalla.LG_MIN) {
          return Pantalla.MD;
      }
      else if (window.innerWidth > TiposTamPantalla.LG_MIN && window.innerWidth <= TiposTamPantalla.XL_MIN) {
          return Pantalla.LG;
      }
      else if (window.innerWidth > TiposTamPantalla.XL_MIN) {
          return Pantalla.XL;
      }
    }
  
    /**
     * Actualiza la configuracion del grid.
     * @param _ColumnaAjustable Ajusta el ancho de la columna al texto
     * @param _ColumnaWrap Se aplica un salto de linea si el texto no entra en el ancho de la columna
     * @param _modoScrolling Puede ser 'infinite' para ir cargando los datos a medida que se va haciendo scroll o
     * 'standard' para que haga el scroll normal
     * @param _focusedRowEnabled Dependiendo del valor pasado (true o false) se pueden seleccionar las filas del grid o no
     * @param _filterRowVisible Permite añadir un filterRow para filtrar por cada columna
     * @param _editable Permite editar una columna
     */
    public actualizarConfig(_ColumnaAjustable: boolean, _ColumnaWrap: boolean, _modoScrolling: string, _focusedRowEnabled: boolean = true, _filterRowVisible: boolean = false, _editable: boolean = false):void 
    {
      this.ColumnaAjustable = _ColumnaAjustable;
      this.ColumnaWrap = _ColumnaWrap;
      this.modoScrolling = _modoScrolling;
      this.focusedRowEnabled = _focusedRowEnabled;
      if(!this.focusedRowEnabled)
        this.modoSeleccion = 'none';
      this.filterRowVisible = _filterRowVisible;
      this.editable = _editable;
    }
  
    dataSource: Array<any>;
    columnas: Array<ColumnDataGrid> = [];
    tipo: string;
    orden: number;
    alturaMaxima: number;
    txtDatosVacios: string;
    ColumnaAjustable: boolean = false;
    ColumnaWrap: boolean = false;
    modoScrolling: string = 'standard';
    focusedRowEnabled: boolean = true;
    modoSeleccion: string = 'single';
    filterRowVisible: boolean = false;
    editable: boolean = false;
    mostrarTotales: boolean = false;
  }