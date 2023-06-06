

  export enum Errores {


        // GLOBAL 10xxxxxx
        Glo_ErrorNoDefinido = 10000000,
        Glo_ErrorInternoServer = 10000001,

        // USUARIOS 11xxxxxx
        Usu_LoginDuplicado = 11000001,

        // VENTAS 12xxxxxx
        ImpVen_DocumentoNoEncontrado = 120000001,
        ImpVen_PrefijoNoValido = 120000002,

        //COMPRAS 13xxxxxx
        ImpCom_DocumentoNoEncontrado = 130000001,
        ImpCom_PrefijoNoValido = 130000002,

        //ARTICULOS 14xxxxxx
        Art_ErrorNoDefinido = 140000001,
        
        ArtFam_ErrorEliminandoFamilia = 140000101,
        ArtFam_ErrorFamiliaAsignada = 140000102,
        
        ArtSubFam_ErrorEliminandoSubFamilia = 140000201,
        ArtSubFam_ErrorSubFamiliaAsignada = 140000202,
        ArtSubFam_ErrorFamiliaNoValida = 140000203,

        //INCIDENCIAS 15xxxxxx
        Inc_ErrorNoDefinido = 150000001,

  }