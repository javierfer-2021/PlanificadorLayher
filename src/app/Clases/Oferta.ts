// Tipos y clases referentes a la gestión de ofertas para el planificador
  export class Oferta {
    IdOferta: number;
    Referencia: string;
    Cliente: string;
    Contrato: string;
    IdEstado: number;
    Estado: string;
    FechaAlta: Date;
    FechaInicio: Date;
    FechaFin: Date;
    Obra: string;
    Observaciones: string;
    IdAlmacen: number;
    Almacen: string;
    NumLineas: number;
  }

  export class OfertaLinea {
    IdOferta: number;
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

  export class LineasCSV {
    IdArticulo: string;
    NombreArticulo: string;
    Unidades: number;
    Mensaje: string;
  }
