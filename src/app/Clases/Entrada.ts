import { NumberSymbol } from "@angular/common";

// Tipos y clases referentes a la gestión de entradas (COMPRAS) para el planificador
export class Entrada {
    IdEntrada: number;
    IdEntradaERP: number;
    Contrato: string;
    Referencia: string;
    FechaAlta: Date;
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
    Aviso?: string;
  }

  export class EntradaLinea {
    IdEntradaERP: string;
    IdEntrada: number;
    IdLinea: number;
    IdArticuloERP: string
    IdArticulo: string;
    NombreArticulo: string;
    Cualidad: number;
    CantidadPedida: number;
    CantidadConfirmada: number;
    CantidadCancelada: number;
    FechaActualizacion: Date;
    FechaPrevista: Date;
    FechaConfirmada: Date;
    Modificada: boolean = false;
    Excepcion: boolean = false;
    Aviso: string;
  }

  /*
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
  */
 
  export class EstadoEntrada {
    IdEstado: number;
    NombreEstado: string;
  }  

  export class filtrosBusqueda {
    mostrarCanceladas: boolean;
    valorContiene: boolean;
    IdArticulo: string;
    IdFamilia: number;
    IdSubfamilia: number;    
    otros: string;
  }

