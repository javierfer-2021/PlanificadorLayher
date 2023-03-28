// Tipos y clases referentes a la gestión de salidas (VENTAS, ALQUILER) para el planificador
export class Salida {
    IdSalida: number;
    IdSalidaERP: number;
    Contrato: string;
    Referencia: string;
    FechaAlta: Date;
    FechaInicio: Date;
    FechaFin: Date;   
    IdEstado: number;
    NombreEstado: string;
    IdCliente: number;
    IdClienteERP: string;
    NombreCliente: string;
    Obra: string;
    Observaciones: string;
    IdAlmacen: number;
    NombreAlmacen: string;
    IdTipoDocumento: number;
    NombreTipoDocumento: string;
    Planificar: boolean;
    NumLineas: number;
    Aviso?: string;

    ClienteMostrar: string;
  }

  export class SalidaLinea {
    IdSalida: number;
    IdLinea: number;
    IdArticulo: string;
    NombreArticulo: string;
    CantidadPedida: number;
    CantidadReservada: number;
    CantidadDisponible: number;
    FechaActualizacion: Date;
  }


  export class SalidaLineaERP {
    IdSalidaERP: string;
    IdLinea: number;
    IdArticuloERP: string
    IdArticulo: string;
    NombreArticulo: string;
    Cantidad: number;
    Cualidad: number;
    Aviso: string;
  }

  export class EstadoSalida {
    IdEstado: number;
    NombreEstado: string;
  }  

  

