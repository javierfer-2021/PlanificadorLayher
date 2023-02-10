
/* -- JN : Clases Originales terminal vstock

  export class Articulo {
    Articulo: string;
    Referencia: string;
    Descripcion: string;
    Mostrar: string;
    Empresa: string;
    IdEmpresa: number;
    IdFormato: number;
  }

  export class ArticuloFormato {
    Articulo: string;
    Referencia: string;
    Descripcion: string;
    Mostrar: string;
    IdFormato: number;
    Formato: string;
    Unidades: number;
  }

*/

export class Articulo {
  IdArticulo: string;
  Descripcion: string;
  Mostrar: string;
}

export class ArticuloCualidad {
  IdArticuloCualidad: number;
  NombreCualidad: string;
  Mostrar: string;
}

export class Almacen {
  IdAlmacen: number;
  NombreAlmacen: string;
  Activo: boolean;
}

export class ArticuloStock {
  IdArticulo: string;
  ArticuloNombre: string;
  IdAlmacen: number;
  NombreAlmacen: string;
  Unidades: number;
  IdCualidad: number;
  NombreCualidad: string;
}