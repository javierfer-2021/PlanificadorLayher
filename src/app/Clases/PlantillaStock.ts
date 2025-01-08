
export class PlantillaStock {
    IdPlantilla:number;
    NombrePlantilla:string;
    IdAlmacen:number;
    NombreAlmacen:string;
    Fecha:Date;
    Descripcion:string;
    Lineas : Array<PlantillaStockLinea> = [];
    // campo aux. Fecha calculo (solo uso en pantalla calculo stock plantilla)
    FechaCalculo:Date;
  }


  export class PlantillaStockLinea {
    IdPlantilla:number;
    IdArticulo:string;
    NombreArticulo:string;
    StockInicial:number;
    UndDisponibles:number;
  }

  // clase utilizada para importar fichero CSV
  export class LineasCSV {
    IdArticulo: string;
    NombreArticulo: string;
    Procesado: boolean; 
    Error: boolean;
    Aviso: string;  
  }