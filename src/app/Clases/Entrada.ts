// Tipos y clases referentes a la gestión de entradas (COMPRAS) para el planificador
export class Entrada {
    IdEntrada: number;
    IdEntradaERP: number;
    Contrato: string;
    Referencia: string;
    FechaAlta: string;
    FechaPrevista: Date;
    FechaConfirmada: Date;   
    IdEstado: number;
    NombreEstado: string;
    IdProveedor: number;
    IdProveedorERP: string;
    NombreProveedor: string;
    Observaciones: string;
    IdAlmacen: number;
    NombreAlmacen: string;
    IdTipoDocumento: number;
    NombreTipoDocumento: string;
    Confirmada: boolean;
    NumLineas: number;
  }

  export class EntradaLinea {
    IdEntrada: number;
    IdLinea: number;
    IdArticulo: string;
    NombreArticulo: string;
    CantidadPedida: number;
    CantidadConfirmada: number;
    CantidadCancelada: number;
    FechaActualizacion: Date;
  }

  export class EntradaLineaERP {
    IdEntradaERP: string;
    IdLinea: number;
    IdArticuloERP: string
    IdArticulo: string;
    NombreArticulo: string;
    Cantidad: number;
    Cualidad: number;
    Aviso: string;
  }

  export class EstadoEntrada {
    IdEstado: number;
    NombreEstado: string;
  }  

  

