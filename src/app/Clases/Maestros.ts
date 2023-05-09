// Tipos y clases referentes a la gestión de maestros (ARTICULOS, STOCK, ALMACENES) para el planificador
export class Articulo {
    IdArticulo: string;
    NombreArticulo: string;
    IdFamilia: number;
    NombreFamilia:string;
    IdSubfamilia: number;
    NombreSubfamilia:string;
    Secundario:boolean;
  }

//  -- NO USADO EN ESTA VERSION
//   export class ArticuloCualidad {
//     IdArticuloCualidad: number;
//     NombreCualidad: string;
//     Mostrar: string;
//   }
  
export class ArticuloFamilia {
  IdFamilia: number;
  CodFamilia: string;
  NombreFamilia: string;
  Importado: boolean;
  FechaActualizacion: Date;
  UsoFiltro: boolean;
}

export class ArticuloSubfamilia {
  IdSubfamilia: number;
  IdFamilia: number;
  NombreSubfamilia: string;
  NombreFamilia: string;
}

  export class Almacen {
    IdAlmacen: number;
    NombreAlmacen: string;
    Prefijo: string;
    Activo: boolean;
  }
  
  export class Stock {
    IdArticulo: string;
    NombreArticulo: string;
    IdAlmacen: number;
    NombreAlmacen: string;
    Unidades: number;
    IdCualidad: number;
    NombreCualidad: string;
    Secundario: boolean;
  }


  export class ArticuloStock {
    IdArticulo: string;
    NombreArticulo: string;
    IdAlmacen: number;
    NombreAlmacen: string;
    Unidades: number;
    IdCualidad: number;
    NombreCualidad: string;
    Secundario: boolean;
    IdFamilia: number;
    NombreFamilia:string;
    IdSubfamilia: number;
    NombreSubfamilia:string;    
  }

  export class Idioma {
    IdIdioma: number;
    NombreIdioma: string;
    iso: string;
    Activo: boolean;
  }

  export class Configuracion {
    Id: number;
    NumItemPlanificador: number;
    EntradaEstadoDefecto: number;
    EntradaAlmacenDefecto: number;
    EntradaConfirmarDefecto: boolean;
    SalidaEstadoDefecto: number;
    SalidaAlmacenDefecto: number;
    SalidaPlanificarDefecto: boolean;
  }

