export enum Notificaciones {


    //20000001 - Error interno del servidor,
    //20000002 - Artículo no válido / no encontrado
    //20000003 - Ubicacion no válida

    //201 Recepcion
    //20100001 - Ubicacion no válida

    //202 Ubicación
    //20200001 - Ubicacion no válida


    //203 Reubicación
    Reu_PaletMultireferencia = 20300001,
    Reu_PaletArticuloCompleto = 20300002,

    //204 Reposición
    Rep_PaletMultireferencia = 20400001,
    Rep_DestinoIntermedia = 20400002,
    Rep_ArticuloCompleto = 20400003,

    //205 Preparacion
    Pre_NoHayMasLineas = 20500001,
    Pre_NoPermiteFinalizarTarea = 20500002,
    Pre_NotificarIncidenciaInterfaces = 20500003,

    //206 Inventario
    Inv_NoHayMasLineas = 20600001,
    Inv_ArtYaLeidoEnPaletUbi = 20600002,
    Inv_UbiSinInvetariar = 20600003,

    //210 Anulacion
    //21000001 - Ubicacion no válida

    //211 Transformacion
    //21100001 - Ubicacion no válida
  }