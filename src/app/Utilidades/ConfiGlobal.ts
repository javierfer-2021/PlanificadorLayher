import { Permiso } from "../Clases/Permiso";
import { environment } from '../../environments/environment';

export class ConfiGlobal {
  
  // version 
  public static version : string ='1.22.43.1';
  
  // traducion label generales 
  public static lbl_NoHayDatos : string = 'No hay datos';

  // configuracion del diseño del terminal
  public static colorReadOnly: string = '#CACACA';
  public static colorValido: string =  '#66cc66';
  public static colorError: string = '#FB7C7C';
  public static colorFoco: string = '#d5f1f9';  //#7ebdfb'; // 7ebdfb
  public static colorGridRowLeido : string = '#ddfad2';     //usado para marcar lineas de un grid segun estado de un campo
  public static altoMinBotonesXS: number = 35;
  public static altoMaxBotonesXS: number = 50;

  public static Ubi_Palet: boolean = false;
  // public static Reu_Palet: boolean = false;
  public static Rep_Palet: boolean = false;
  public static Rep_Intermedia: boolean = false;

  public static Consolidacion: boolean = false;
  public static Descargas: boolean = false;
  public static Devoluciones: boolean = false;

  public static principalValidando: boolean = false;

  // frm-login y canActivate
  public static autorizacion: boolean = false;

  public static Token: string = '';
  public static Usuario: number;
  public static NombreUsuario: string;
  public static sessionId: string;

  public static HttpTimeWait: number;
  public static Rec_GenerarPaletPorLinea: boolean = false;


  // frm-login y errores
  public static mensajeError: string;
  public static errorGuardado: number;

  // ==================== Conexión WebApi ====================
  // local
  // private static dominio = 'http://localhost';
  // private static dominio = 'http://192.168.1.129'; // IP Alejandro

  // JAT IP
  // private static dominio = 'http://192.168.200.69'; // ZEROTIER
  // private static dominio = 'http://192.168.10.234'; // OPENVPN esta
  // private static dominio = 'http://192.168.10.40';
  // private static dominio = 'http://192.168.10.158'; // Servidor Viletel
  // private static dominio = 'http://192.168.1.110'; // ALFRAN

  public static dominio: string = environment.dominio;

  // ARF IP
  // private static dominio = 'http://192.168.200.80';

  // DS IP
  // private static dominio = 'http://192.168.10.232';

  // private static puerto = '49220';
  // private static puerto = '49221';
  // private static puerto = '8081'; // IIS y Servidor
  // private static puerto = '9200'; // ALFRAN
  public static puerto: string = environment.puerto;

  public static URL: string = ConfiGlobal.dominio + ':' + ConfiGlobal.puerto;

  // EAN 128
  public static CharEAN128; // '%'
  public static PrefijosEAN128: Array<string> = [];

  // QR
  public static CharQR; // '@'
  public static PrefijosQR: Array<string> = [];

  // ConfiGrid
  public static SeparadorGrid: string; // '%;&_'

  // Array de Permisos para los botones
  public static Permisos: Array<Permiso> = new Array<Permiso>();

  public static WebSocket_IP: string;
  public static WebSocket_PORT: number;
  public static WebSocket_Enabled: boolean = false;


  // Configuracion Para cada boton de la pantalla principal
  // public static disRecepcion: boolean = environment.disRecepcion;
  // public static disPicking: boolean = environment.disPicking;
  // public static disUbicacion: boolean = environment.disUbicacion;
  // public static disReubicacion: boolean = environment.disReubicacion;
  // public static disImpDocument: boolean = environment.disImpDocument;
  // public static disReposicion: boolean = environment.disReposicion;
  // public static disInventario: boolean = environment.disInventario;
  // public static disAsigPicking: boolean = environment.disAsigPicking;
  // public static disBuscarArt: boolean = environment.disBuscarArt;
  // public static disBuscarUbi: boolean = environment.disBuscarUbi;
  // public static disBuscarPalet: boolean = environment.disBuscarPalet;
  // public static disImpEtiq: boolean = environment.disImpEtiq;
  // public static disBuscarDesc: boolean = environment.disBuscarDesc;
  // public static disAsignarEAN14: boolean = environment.disAsignarEAN14;
  // public static disComprobarEAN: boolean = environment.disComprobarEAN;
  // public static disAnalizarLectura: boolean = environment.disTest;
  // public static disLog: boolean = environment.disLog;

  public static disRecepcion: boolean = false;
  public static disPicking: boolean = false;
  public static disUbicacion: boolean = false;
  public static disReubicacion: boolean = false;
  public static disImpDocument: boolean = false;
  public static disReposicion: boolean = false;
  public static disInventario: boolean = false;
  public static disAsigPicking: boolean = false;
  public static disBuscarArt: boolean = false;
  public static disBuscarUbi: boolean = false;
  public static disBuscarPalet: boolean = false;
  public static disImpEtiq: boolean = false;
  public static disBuscarDesc: boolean = false;
  public static disAsignarEAN14: boolean = false;
  public static disComprobarEAN: boolean = false;
  public static disAnalizarLectura: boolean = false;
  public static disVerLog: boolean = false;

  // temp - configuracion adicional pantalla IMP-DOCUMENTACION
  public static impDoc_configBotonLimpiar : boolean = false; 
  public static impDoc_configEtiquetasCero : boolean = false;
  public static impDoc_configPesoVolumenCero : boolean = false;
  public static impDoc_configConfirmarImprimir : boolean = false;
  public static impDoc_configAutoCerrarContenedores : boolean = false;  // Cierre automatico pantalla lectira contenedores si todos leidos
  public static impDoc_configWarningNumeroPalet : number = -1;          // Valor limite para warning verificar numero de palets (-1 = no warning)
  public static impDoc_configWarningAlturaPalet : number = -1;          // Valor limite para warning verificar altura de palets (-1 = no warning)
  public static impDoc_configTipoPaletDefecto : number = -1;            // ID predeterminado para selección del tipo de palet
 
  // configuracion descargas -> valores not null
  // public static DescargasConfig : Configuraciones.Config_Descargas = new Configuraciones.Config_Descargas();

  public static LOG: Array<string> = new Array<string>();
}
