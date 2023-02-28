// Tipos y clases referentes a la gestión de incidencias para el planificador
export class Incidencia {
    IdIncidencia: number;
    FechaAlta: Date;
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
    IdDocumento: number;
    IdTipoDocumento: number;    
    NombreTipoDocumento: string;
    IdAlmacen: number;
    Almacen: string;
  }

  export class TipoIncidencia {
    IdTipoIncidencia: number;
    NombreTipoIncidencia: string;
  }  
