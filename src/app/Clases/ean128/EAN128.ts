import {AII} from "./AII";
import {DATOSETIQUETA} from "./DATOSETIQUETA";
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { TipoLectura } from '../../Enumeraciones/TipoLectura';

export class EAN128 {

    private _IsEan128: boolean;
    private  _FNC1: string;
    public _listaAII: AII[] = [];
    private _Datos: GS1DATOSDECO = new GS1DATOSDECO();

    // Propiedades
    public FNC1(value): string {
        get: {
            return this._FNC1;
        }
        set: {
            this._FNC1 = value;
        }
    }

    public IsEan128(value): boolean {
        get: {
            return this._IsEan128;
        }
        set: {
            this._IsEan128 = value;
        }
    }

    // Constructores
    constructor(FNC: string) {
        this.CargarAII();
        this._FNC1 = FNC;
    }

    // Metodos Internos
    private BuscaAIIxDesc(str: string): AII {
        // Este return de abajo devuelve el primer objeto que encuentre y que coincida su "Desc" con str
        return this._listaAII.filter(x => x.Desc === str)[0];
    }

    private buscaAII(str: string): AII {
        var cadena: string = str.substr(0, 2);
        var p = this._listaAII.filter(x => x.AICode.indexOf(cadena) === 0);

        if (p.length === 1) {
            return p[0];
        } else {
            return p.filter(x => x.AICode === str)[0];
        }
    }



    private LeerValores(barcode: string) {
        let miAII: AII;
        let valor: string;

        try {
            // Compruebo que el primer caracter es FNC1

            if (barcode.substr(0, 1) !== this._FNC1) {
                this._IsEan128 = false;
                return;
            }

            let indiceStart = 1;
            this._IsEan128 = true;

            while (indiceStart < barcode.length) {
                const strAI = barcode.substr(indiceStart, 4);

                miAII = this.buscaAII(strAI);

                if (miAII.maxLength === miAII.minLength) {
                    // Longitud Fija
                    valor = barcode.substr(indiceStart + miAII.AICode.length, miAII.maxLength);
                    indiceStart += miAII.AICode.length + miAII.maxLength;
                }
                else { // Longitud variable, tengo que buscar el caracter separador
                    let longi: number = barcode.indexOf(this._FNC1, indiceStart);
                    if (longi === -1) {
                        valor = barcode.substr(indiceStart + miAII.AICode.length);  // Leo hasta el final de la etiqueta
                        longi = miAII.maxLength;
                    }

                    else {
                        longi = longi - indiceStart - miAII.AICode.length;
                        valor = barcode.substr(indiceStart + miAII.AICode.length, longi);
                    }

                    indiceStart += miAII.AICode.length + longi + 1; // Añado uno por el separador
                }

                // Tengo que escribir el dato
                this.GuardarDatosDecodificados(miAII, valor);
            }
        } catch (ex) {

        }
    }

    private CargarAII() {
        this._listaAII.push(new AII('00', 18, 18, 'SSCC', 'string'));
        this._listaAII.push(new AII('01', 14, 14, 'ArticuloAgrupacion', 'string'));
        this._listaAII.push(new AII('02', 14, 14, 'ArticuloAgrupacionContenido', 'string'));
        this._listaAII.push(new AII('37', 1, 8, 'CantidadContenido', 'decimal'));
        this._listaAII.push(new AII('10', 1, 20, 'Lote', 'string'));
        this._listaAII.push(new AII('11', 6, 6, 'FechaFabricacion', 'date'));
        this._listaAII.push(new AII('13', 6, 6, 'FechaEnvasado', 'date'));
        this._listaAII.push(new AII('15', 6, 6, 'FechaConsumoPreferente', 'date'));
        this._listaAII.push(new AII('17', 6, 6, 'FechaCaducidad', 'date'));
        this._listaAII.push(new AII('20', 2, 2, 'Variante', 'string'));
        this._listaAII.push(new AII('21', 1, 20, 'NumeroSerie', 'string'));
        this._listaAII.push(new AII('310X', 6, 6, 'PesoNeto', 'decimal'));
        this._listaAII.push(new AII('330X', 6, 6, 'PesoBruto', 'decimal'));
        
        this._listaAII.push(new AII('240', 3, 30, 'ProductoCliente', 'string'));
    }

    private checkSum(pgtin: string, pchecksum: number): boolean {
        let ret: boolean = false;
        let glength: number = 0;
        let total: number = 0;
        let cSum: number = 0;
        let mutiply: number[] = [3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
        glength = 17 - pgtin.length;
        for (let i = 0; i < pgtin.length; i++) {
            total = total + (parseInt(pgtin[i].toString()) * mutiply[i + glength]);
        }
        cSum = 10 - (total % 10);
        if (cSum === pchecksum) {
            ret = true;
        }
        return ret;
    }

    private checkDate(pdate: string): Date {
        let convertedDate: Date = new Date('0001-01-01T00:00:00Z');
        if (pdate.substr(4, 2) === '00') {
            try {

                let mes = parseInt(pdate.substr(2, 2));
                let anyo = parseInt(pdate.substr(0, 2));
                mes += 1;
                anyo += 2000

                let m: Date = new Date(anyo, mes, 0);
                let dia: number = 1;
                pdate = anyo.toString() + '-' + (mes - 1).toString() + '-' + dia.toString();
            } catch {
                return convertedDate;
            }
        }
        else {
            try {
                let dia = parseInt(pdate.substr(4, 2));
                let mes = parseInt(pdate.substr(2, 2));
                let anyo = parseInt(pdate.substr(0, 2));
                anyo += 2000
                let m: Date = new Date(anyo, mes, 0);

                pdate = anyo.toString() + '-' + mes.toString() + '-' + dia.toString();
            } catch {
                return convertedDate;
            }
        }

        try {
            convertedDate = new Date(pdate);
        } catch (Exception) {

        }

        return convertedDate;
    }

    private GuardarDatosDecodificados(a: AII, valor: string) {
        switch (a.AICode) {
            case '00':
                if (valor === undefined || valor === null || valor.length === 0) break;

                let str1 = valor.substring(0,9);
                if(isNaN(Number(str1)))
                    break;

                let str2 = valor.substring(9);
                if(isNaN(Number(str2)))
                    break;

                let pal1 = parseInt(str1);
                let pal2 = pal1 === 0 ? parseInt(str2).toString() : str2;
                this._Datos.SSCC = pal1 === 0 ? pal2 : pal1.toString() + pal2;

                // this._Datos.SSCC = valor;
                break;

            case '01':
                this._Datos.ArticuloAgrupacion = valor;
                break;

            case '02':
                this._Datos.ArticuloAgrupacionContenido = valor;
                break;

            case '10':
                this._Datos.Lote = valor;
                break;

            case '11':
                this._Datos.FechaFabricacion = this.checkDate(valor);
                break;

            case '13':
                this._Datos.FechaEnvasado = this.checkDate(valor);
                break;

            case '15':
                this._Datos.FechaConsumoPreferente = this.checkDate(valor);
                break;

            case '17':
                this._Datos.FechaCaducidad = this.checkDate(valor);
                break;

            case '20':
                this._Datos.Variante = valor;
                break;

            case '21':
                this._Datos.NumeroSerie = valor;
                break;

            case '37':
                this._Datos.CantidadContenido = parseFloat(valor);
                break;

            case '310X':
                this._Datos.PesoNeto = parseFloat(valor);
                break;

            case '330X':
                this._Datos.PesoBruto = parseFloat(valor);
                break;

            case '240':
                this._Datos.ProductoCliente = valor;
                break;
        }
    }

    // Metodos Publicos
    public Read(barcode: string): GS1DATOSDECO {
        this._Datos = new GS1DATOSDECO();
        this.LeerValores(barcode);
        return this._Datos;
    }

    public GetTextoEtiqueta(datos: GS1DATOSDECO): DATOSETIQUETA {
        let a: AII = new AII();
        let valo: DATOSETIQUETA;
        let sb: string = '';
        let sc: string = '';
        sb += this._FNC1;
        if (datos.SSCC !== null && datos.SSCC !== undefined && datos.SSCC !== '') {
            a = this.BuscaAIIxDesc('SSCC');
            sb += a.AICode + datos.SSCC;
            sc += a.AICode + datos.SSCC;
        }

        if (datos.ArticuloAgrupacion !== null && datos.ArticuloAgrupacion !== undefined && datos.ArticuloAgrupacion !== '') {
            a = this.BuscaAIIxDesc('ArticuloAgrupacion');
            sb += a.AICode + datos.ArticuloAgrupacion;
            sc += '(' + a.AICode + ')' + datos.ArticuloAgrupacion;
        }

        if (datos.ArticuloAgrupacionContenido !== null && datos.ArticuloAgrupacionContenido !== undefined && datos.ArticuloAgrupacionContenido !== '') {
            a = this.BuscaAIIxDesc('ArticuloAgrupacionContenido');
            sb += a.AICode + datos.ArticuloAgrupacionContenido;
            sc += '(' + a.AICode + ')' + datos.ArticuloAgrupacionContenido;
        }

        if ((datos.CantidadContenido) !== null && datos.CantidadContenido !== undefined) {
            a = this.BuscaAIIxDesc('CantidadContenido');
            let str: string = datos.CantidadContenido.toString();

            if (str.length % 2 !== 0) str = '0' + str;

            sb += a.AICode + str;
            sc += '(' + a.AICode + ')' + str;
            if (a.maxLength !== a.minLength)
                sb += this._FNC1;

        }

        if (datos.FechaFabricacion != null) {
            a = this.BuscaAIIxDesc('FechaFabricacion');
            sb += a.AICode + this.formatDate(datos.FechaFabricacion);
            sc += '(' + a.AICode + ')' + this.formatDate(datos.FechaFabricacion);
        }

        if (datos.FechaEnvasado != null) {
            a = this.BuscaAIIxDesc('FechaEnvasado');
            sb += a.AICode + this.formatDate(datos.FechaEnvasado);
            sc += '(' + a.AICode + ')' + this.formatDate(datos.FechaEnvasado);
        }

        if (datos.FechaConsumoPreferente != null) {
            a = this.BuscaAIIxDesc('FechaConsumoPreferente');
            sb += a.AICode + this.formatDate(datos.FechaConsumoPreferente);
            sc += '(' + a.AICode + ')' + this.formatDate(datos.FechaConsumoPreferente);
        }

        if (datos.FechaCaducidad != null) {
            a = this.BuscaAIIxDesc('FechaCaducidad');
            sb += a.AICode + this.formatDate(datos.FechaCaducidad);
            sc += '(' + a.AICode + ')' + this.formatDate(datos.FechaCaducidad);
        }

        if (datos.Variante !== null && datos.Variante !== undefined && datos.Variante !== '') {
            a = this.BuscaAIIxDesc('Variante');
            sb += a.AICode + datos.Variante;
            sc += '(' + a.AICode + ')' + datos.Variante;
        }

        if (datos.Lote !== null && datos.Lote !== undefined && datos.Lote !== '') {
            a = this.BuscaAIIxDesc('Lote');
            sb += a.AICode + datos.Lote;
            if (a.maxLength != a.minLength)
                sb += this._FNC1;
            sc += '(' + a.AICode + ')' + datos.Lote;
        }


        if (datos.NumeroSerie !== null && datos.NumeroSerie !== undefined && datos.NumeroSerie !== '') {
            a = this.BuscaAIIxDesc('NumeroSerie');
            sb += a.AICode + datos.NumeroSerie;
            if (a.maxLength != a.minLength)
                sb += this._FNC1;
            sc += '(' + a.AICode + ')' + datos.NumeroSerie;
        }

        if ((datos.PesoBruto) != null) {
            a = this.BuscaAIIxDesc('PesoBruto');
            let str: string = datos.PesoBruto.toString();
            sb += a.AICode + str;
            sc += '(' + a.AICode + ')' + str;
        }

        if ((datos.PesoNeto) != null) {
            a = this.BuscaAIIxDesc('PesoNeto');
            let str: string = datos.PesoNeto.toString();
            sb += a.AICode + str;
            sc += '(' + a.AICode + ')' + str;
        }

        if (datos.ProductoCliente !== null && datos.ProductoCliente !== undefined && datos.ProductoCliente !== '') {
            a = this.BuscaAIIxDesc('ProductoCliente');
            sb += a.AICode + datos.ProductoCliente;
            if (a.maxLength != a.minLength)
                sb += this._FNC1;
            sc += '(' + a.AICode + ')' + datos.ProductoCliente;
        }

        if (sb[sb.length - 1].toString() == this._FNC1)
            sb = sb.substr(0, sb.length - 1); //sb.Remove(sb.Length-1, 1);
        valo.codigoBarras = sb.toString();
        valo.Descripcion = sc.toString();
        return valo;
    }

    private formatDate(date): string {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear().toString();

        year = year.substr(2, 4);

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('');
    }

}

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