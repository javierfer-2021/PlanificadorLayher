// Tipos y clases referentes a la gestión de incidencias para el planificador
export class Incidencia {
    IdIncidencia: number;    
    FechaAlta: Date;
    FechaIncidencia: Date;
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
    IdAlmacen: number;
    Almacen: string;
    IdDocumento: number;
    IdTipoDocumento: number;        
    NombreTipoDocumento: string;
    Contrato: number;
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number; 
    Observaciones: string;   
  }

  export class TipoIncidencia {
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
    NombreCorto: string;
    RequiereDocumento:boolean;
    TipoDocumento:number;
    Activo:boolean;
  }  
