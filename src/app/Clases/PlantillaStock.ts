
export class PlantillaStock {
    IdPlantilla:number;
    NombrePlantilla:string;
    IdAlmacen:number;
    NombreAlmacen:string;
    Fecha:Date;
    Descripcion:string;
    Lineas : Array<PlantillaStockLinea> = [];
  }


  export class PlantillaStockLinea {
    IdPlantilla:number;
    IdArticulo:string;
    NombreArticulo:string;
    stockInicial:number;
    UndDisponibles:number;
  }