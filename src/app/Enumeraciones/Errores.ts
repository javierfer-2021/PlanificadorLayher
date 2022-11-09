

  export enum Errores {
    //        (500) Error interno del servidor.
    //10000001 - Error interno del servidor,
    //10000002 - Artículo no válido / no encontrado
    //10000003 - Ubicacion no válida
    Glo_ArticuloNoValido = 10000002,
    Glo_NoValido = 10000003,
    Glo_UbicacionNoValido = 10000004,
    Glo_UbiPickArtYaAsignado = 10000005,
    Glo_UbiPickArtNoExiste = 10000006,
    //101 Recepcion
    Rec_UbicacionNoValida = 10100001,
    Rec_ArticuloNoValido = 10100002,
    Rec_PaletNoValido = 10100003,
    Rec_PedidoSinLineas = 10100004,
    Rec_SinDatosTarea = 10100005,
    Rec_PaletYaCerrado = 10100006,
    Rec_CantidadErronea = 10100007,
    Rec_CantidadEnExceso = 10100008,
    Rec_LoteNoValido = 10100009,
    Rec_FechaCaducidadNoValida = 10100010,
    Rec_TareaYaCerrada = 10100011,
    Rec_TareaNoTieneLineasRealizadas = 10100012,
    Rec_AlbaranNoValido = 10100013,
    //102 Ubicación
    Ubi_UbicacionNoValida = 10200001,  
    Ubi_PedidoProveedorNoValido = 10200002,
    Ubi_PaletNoValido = 10200003,
    //103 Reubicacion
    Reu_UbicacionNoValida = 10300001,
    Reu_ArticuloNoValido = 10300002,
    Reu_PaletNoValido = 10300003,
    Reu_OrigenIgualDestino = 10300004,
    //104 Reposicion
    Rep_UbicacionNoValida = 10400001,
    Rep_ArticuloNoValido = 10400002,
    Rep_PaletNoValido = 10400003,
    Rep_OrigenIgualDestino = 10400004,
    Rep_ReposicionNoValida = 10400005,
    //105 Preparacion
    Pre_UbicacionNoValida = 10500001,
    Pre_ArticuloNoValido = 10500002,
    Pre_PaletNoValido = 10500003,
    Pre_PedidoSinLineas = 10500004,
    Pre_SinDatosLinea = 10500005,
    Pre_UnidadesInsuficientes = 10500006,
    PreDoc_ContendorNoValido = 10500101,      
    // 106 Inventario
    Inv_UbicacionNoValida = 10600001,
    Inv_ArticuloNoValido = 10600002,
    Inv_PaletNoValido = 10600003,
    Inv_LoteNoValido = 10600004,
    Inv_FechaCaducidadNoValida = 10600005,
    Inv_CantidadErronea = 10600006,
    Inv_PaletYaCerrado = 10600007,
    Inv_SinDatosTarea = 10600008,
    Inv_TareaYaCerrada = 10600009,
    Inv_TareaSinLineasRealizadas = 10600010,
    

    //110 Anulacion
    //11000001 - Ubicacion no válida
    //111 Transformacion
    //11100001 - Ubicacion no válida
  }