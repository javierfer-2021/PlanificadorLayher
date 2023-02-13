// Tipos y clases referentes a la gestión de ofertas para el planificador
export class Compra {
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
    NumLineas: number;
  }

  export class LineaCompra {
    IdOferta: string;
    IdLinea: number;
    IdArticulo: string;
    ArticuloNombre: string;
    CantidadPedida: number;
    CantidadReservada: number;
    CantidadDisponible: number;
    FechaActualizacion: Date;
  }

  export class EstadoCompra {
    IdEstado: number;
    NombreEstado: string;
  }

