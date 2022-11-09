

export class PreparacionLinea {
    IdLinea: number;
    Articulo: string;
    Referencia: string;
    Descripcion: string;
    Mostrar: string;
    Ubicacion: string;
    UbicacionCodigo: string;
    Disponibles: number;
    Pedidas: number;
    Orden: number; 
    PaletCompleto: boolean;
    InfoPrincipal: string;
    InfoCantidad: string;
    Contenedor: number;
    CambiarContenedor: boolean;
    UbicacionVacia: boolean;
    RecogerSerie: number;
    InfoRecogerSerie: string;
    TipoPeso: number;
    InfoPeso: string;
    IdFormato: number;
    Formato: string;
    UnidadesFormato: number;
    PesoVariable: boolean; // ??
    ServirPedidas: boolean;
    Multilote: boolean; 
    InfoMultilote: string;
    UbicacionAutoValidada: boolean;
    PermitirForzarFinTarea: number; // -1 oculto, 0 deshabilitado, 1 habilitado
  }