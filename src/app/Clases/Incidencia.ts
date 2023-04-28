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
  }

  export class TipoIncidencia {
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
    NombreCorto: string;
    Descripcion: string;
    RequiereDocumento:boolean;
    TipoDocumento:number;
    Activo:boolean;
  }  
