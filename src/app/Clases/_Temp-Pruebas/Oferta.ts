// Tipos y clases referentes a la gestión de ofertas para el planificador
  export class Oferta {
    IdOferta: string;
    Referencia: string;
    Cliente: string;
    Contrato: string;
    IdEstado: number;
    Estado: string;
    FechaAlta: string;
    FechaInicio: Date;
    FechaFin: Date;
    Obra: string;
    Observaciones: string;
    IdAlmacen: number;
    Almacen: string;
    NumLineas?: number;
    TipoDocumento?: string;
    Aviso?: string;
  }

  export class OfertaLinea {
    IdOferta: string;
    IdLinea: number;
    IdArticulo: string;
    ArticuloNombre: string;
    CantidadPedida: number;
    CantidadReservada: number;
    CantidadDisponible: number;
    FechaActualizacion: Date;
  }

  export class EstadoOferta {
    IdEstado: number;
    NombreEstado: string;
  }

  export class Almacen {
    IdAlmacen: number;
    NombreAlmacen: string;
  }

  export class LineasCSV {
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number;
  }

  export class LineasCSV_Validadas {
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number;
    UnidadesDisponibles: number;
    Avisos: number;
    Mensaje: string;
  }

  export class LineaOferta_ERP {
    IdOferta: string;
    IdLinea: number;
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number;
    UnidadesDisponibles: number;
    Avisos: number;
    Mensaje: string;
  }
