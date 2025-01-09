
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
    // campos aux. Uso para control importacion CSV
    Procesado: boolean; 
    Error: boolean;
    Mensaje: string;      
  }

  // clase utilizada para importar fichero CSV
  export class LineaCSV {
    IdArticulo: string;
    NombreArticulo: string;
    StockInicial:number;
    Procesado: boolean; 
    Error: boolean;
    Mensaje: string;  
  }