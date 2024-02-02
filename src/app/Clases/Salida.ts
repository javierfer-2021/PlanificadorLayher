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
    //uso opcional y adicional para importación lineas csv 
    IdSimulacion: string;
  }

  export class SalidaLinea {
    IdSalidaERP: string;  //imp ERP
    IdSalida: number;
    IdLinea: number;
    IdArticuloERP: string;  //imp ERP
    IdArticulo: string;
    NombreArticulo: string;
    CantidadPedida: number;
    CantidadReservada: number;
    CantidadDisponible: number;
    FechaActualizacion: Date;
    Cualidad: number;   //imp ERP
    Prioridad: boolean;
    Eliminada: boolean;
    Insertada: boolean;
    Observaciones: string;
    Modificada: boolean = false;
    //uso gestion de excepciones
    Excepcion: boolean = false;  
    FechaInicio: Date;
    FechaFin: Date;
    //uso opcional y adicional para importación lineas csv 
    IdSimulacion: string;
    Aviso: string;     
  }

  /*
  class SalidaLineaERP {
    IdSalidaERP: string;
    IdLinea: number;
    IdArticuloERP: string;
    IdArticulo: string;
    NombreArticulo: string;
    Cantidad: number;
    Cualidad: number;
    Aviso: string;
  }
  */

  export class LineasCSV {
    IdArticulo: string;
    NombreArticulo: string;
    CantidadPedida: number;
    Procesado: boolean; 
    Error: boolean;
    Aviso: string;  
    //uso gestion de excepciones
    Modificada: boolean = false;
    Excepcion: boolean = false;  
    FechaInicio: Date;
    FechaFin: Date;     
  }

  export class EstadoSalida {
    IdEstado: number;
    NombreEstado: string;
  }  

  export class filtrosBusqueda {
    mostrarCanceladas: boolean;
    valorContiene: boolean;
    IdArticulo: string;
    IdFamilia: number;
    IdSubfamilia: number;
    buscarSinConfirmar: boolean;
    diasSinConfirmar: number;
    otros: string;
  }

