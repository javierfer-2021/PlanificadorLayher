import {ConfiGlobal} from '../Utilidades/ConfiGlobal';
export class UtilidadesLayher {

    constructor(){ }

//#region - ENTRADAS -

    //valor Estado entrada por defecto
    public static entradaEstadoPorDefecto():any {
        return (ConfiGlobal.configLayher.EntradaEstadoDefecto==0) ? null : ConfiGlobal.configLayher.EntradaEstadoDefecto;
    }

    //valor Almacen entrada por defecto
    public static entradaAlmacenPorDefecto(contrato:string):any {
        let valor;
        switch (ConfiGlobal.configLayher.EntradaAlmacenDefecto) {
            case 1 : valor=ConfiGlobal.DatosUsuario.idAlmacenDefecto;
            break;
            case 2 : valor= this.calcularAlmacen(contrato);
            break;
            default : valor=null;
        }            
        return valor;    
    }

    //valor Confirmar entrada por defecto
    public static entradaValorConfirmadoPorDefecto():boolean {
        return ConfiGlobal.configLayher.EntradaConfirmarDefecto;
    }

//#endregion


//#region - SALIDAS -    

    //valor Estado salida por defecto
    public static salidaEstadoPorDefecto():any {
        return (ConfiGlobal.configLayher.SalidaEstadoDefecto==0) ? null : ConfiGlobal.configLayher.SalidaEstadoDefecto;
    }

    //valor Almacen salida por defecto
    public static salidaAlmacenPorDefecto(contrato:string):any {
        let valor;
        switch (ConfiGlobal.configLayher.SalidaAlmacenDefecto) {
            case 1 : valor=ConfiGlobal.DatosUsuario.idAlmacenDefecto;;
            break;
            case 2 : valor= this.calcularAlmacen(contrato);
            break;
            default : valor=null;
        }            
        return valor;    
    }    

    //valor Planificar salida por defecto
    public static salidaValorPlanificarPorDefecto():boolean {
        return ConfiGlobal.configLayher.SalidaPlanificarDefecto;
    }    

    public static calcularAlmacen(contrato:string):any{
        //return ConfiGlobal.DatosUsuario.idAlmacenDefecto;
        let valor=null;
        let delegacion:string= contrato.substring(2,3);
        switch (delegacion) {
            case '1': valor=1;
            break;
            case '2': valor=2;
            break;
            case '3': valor=3;
            break;
            case '4': valor=4;
            break;
            default: break;
        }
        return valor;
    }

//#endregion

}