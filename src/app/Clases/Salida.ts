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
    Prioridad: boolean;
    Eliminada: boolean;
    Insertada: boolean;
    Observaciones: string;
    FechaInicio: Date;
    FechaFin: Date;               
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

  export class filtrosBusqueda {
    IdFamilia: number;
    IdSubfamilia: number;
    mostrarCanceladas: boolean;
    otros: string;
  }

