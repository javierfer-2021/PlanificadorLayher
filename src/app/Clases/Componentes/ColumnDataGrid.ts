import { dxDataGridColumn } from 'devextreme/ui/data_grid';


export class ColumnDataGrid {
    dataField?: string;
    caption?: string;
    visible?: boolean;
    sortIndex?: number;
    sortOrder?: string;
    type?: string;
    buttons?: any;
    width?: number;
    alignment?: string; 
    fixed?: boolean;
    fixedPosition?: string;
    allowEditing?: boolean = false;
    columns?: Array<dxDataGridColumn | string>;
    cssClass?: string;
    dataType?: string;

  }