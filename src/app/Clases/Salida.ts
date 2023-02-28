// Tipos y clases referentes a la gestión de salidas (VENTAS, ALQUILER) para el planificador
export class Salida {
    IdSalida: number;
    IdERP: number;
    Contrato: string;
    Referencia: string;
    FechaAlta: string;
    FechaInicio: Date;
    FechaFin: Date;   
    IdEstado: number;
    Estado: string;
    IdCliente: number;
    IdClienteERP: string;
    NombreClienter: string;
    Obra: string;
    Observaciones: string;
    IdAlmacen: number;
    Almacen: string;
    Planificar: boolean;
    NumLineas: number;
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

  export class EstadoSalida {
    IdEstado: number;
    NombreEstado: string;
  }  

  

