import {ConfiGlobal} from "../../Utilidades/ConfiGlobal";
import { EAN128 } from "./EAN128";
import { TipoLectura } from '../../Enumeraciones/TipoLectura';

export class GS1DATOSDECO {
    public SSCC: string;
    public ArticuloAgrupacion: string;
    public ArticuloAgrupacionContenido: string;
    public CantidadContenido: number;
    public Lote: string;
    public FechaFabricacion: Date;
    public FechaEnvasado: Date;
    public FechaConsumoPreferente: Date;
    public FechaCaducidad: Date;
    public Variante: string;
    public NumeroSerie: string;
    public PesoNeto: number;
    public PesoBruto: number;
    public TipoLectura: TipoLectura;
    public CadenaOrigen: string;
    public ProductoCliente: string;

    public static decodificarEan128(codigo: string): GS1DATOSDECO {
        return this.decodificarCodigo(codigo, ConfiGlobal.PrefijosEAN128, ConfiGlobal.CharEAN128);
    }

    public static decodificarQR(codigoQR: string): GS1DATOSDECO {
        return this.decodificarCodigo(codigoQR, ConfiGlobal.PrefijosQR, ConfiGlobal.CharQR, true);
    }

    private static decodificarCodigo(codigo: string, Prefijos: Array<string>, FNC1: string, esQR:boolean = false): GS1DATOSDECO {
        let codigoOriginal = codigo;
        if (codigoOriginal === undefined || codigoOriginal === null || codigoOriginal.length === 0) return null;

        let _ean = new EAN128(FNC1);
        Prefijos.forEach(prefijo => {
            if(esQR) {
                if (codigoOriginal.substr(0, 3) === prefijo){
                    if (_ean._listaAII.filter(aii => aii.AICode === codigoOriginal.substr(3, 2) || aii.AICode === codigoOriginal.substr(3, 3)).length !== 0) {
                        codigoOriginal =  FNC1 + codigoOriginal.substr(3, codigoOriginal.length);
                    }
                }
            } else {
                if (codigoOriginal.substr(0, 3) === prefijo){
                    if (_ean._listaAII.filter(aii => aii.AICode === codigoOriginal.substr(3, 2) || aii.AICode === codigoOriginal.substr(3, 3)).length !== 0) {
                        codigoOriginal =  FNC1 + codigoOriginal.substr(3, codigoOriginal.length);
                    }
                }
            }
        });
        
        
        if (codigoOriginal.substr(0, 1) !== FNC1) {
            return null;
        } else {
            let datos = _ean.Read(codigoOriginal);
            return datos;
        }
    }
}