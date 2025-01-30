// Tipos y clases referentes a la gestión de incidencias para el planificador
export class Incidencia {
    IdIncidencia: number;    
    FechaAlta: Date;
    FechaIncidencia: Date;
    IdTipoIncidencia: number;
    Descripcion: string;
    NombreTipoIncidencia: string;
    NombreCortoTipoIncidencia: string;
    IdAlmacen: number;
    NombreAlmacen: string;
    IdDocumento: number;
    IdTipoDocumento: number;        
    NombreTipoDocumento: string;
    Contrato: string;
    IdCliProv: string;
    NombreCliProv: string;
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number; 
    Observaciones: string;   
    IdUsuario: number;
    SeleccionarArticuloDocumento: boolean;
    CoincideAlmacen: boolean;    
    // info adicional para incluir lineas asociadas.
    Lineas: Array<LineaIncidencia> = [];
  }

  export class TipoIncidencia {
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
    NombreCorto: string;
    Descripcion: string;
    RequiereDocumento:boolean;
    TipoDocumento:number;
    SeleccionarArticuloDocumento: boolean;
    CoincideAlmacen: boolean;    
    Activo:boolean;
  }  

  // act. 2025 - Asociar lineas incidencia
  export class LineaIncidencia {
    IdIncidencia: number;    
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number; 
    Observaciones: string;   
  }

  // act. 2025 - Asociar lineas incidencia
  // clase utilizada para importar fichero CSV
  
  export class LineaCSV {
    IdArticulo: string;
    NombreArticulo: string;
    Unidades:number;
    Observaciones: string;
    Procesado: boolean; 
    Error: boolean;
    Mensaje: string;  
  }

  /*
  export class DocumentoIncidencia {
    IdDocumento: number;
    IdTipoDocumento: number;        
    NombreTipoDocumento: string;
    Contrato: string;
    IdCliProv: string;
    NombreCliProv: string;
  } 
  */ 
