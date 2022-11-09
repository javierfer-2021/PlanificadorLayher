import { DescargaLineas } from "./DescargaLineas";

  export class Descarga {    
    IdTarea: number;
    IdDescarga: string;
    IdEstado: number;
    Estado: string;
    FechaAlta: Date;
    FechaPrevista: Date;    
    FechaInicio: Date;
    FechaFin: Date;   
    IdEmpresa: number;
    Empresa: string;
    RefExterna: string;
    IdTransporte?: number;
    Transporte: string;
    IdTipoVehiculo?: number;
    TipoVehiculo: string;
    Matricula: string;
    Conductor: string;
    Remolque: string;
    Contenedor: string;
    Precinto: string;
    Temperatura: number;
    Granel: boolean;
    Observaciones: string;    
    Info: string;
    IdUsuario: number;    
    Muelle: string;
    Ubicacion: string;
    UbiCodigo: string;

    mediosLogisticos_predefinidos : boolean = false;
    lineas_mediosLogisticos: Array<DescargaLineas> = [];

    // configuracion valores reqeridos para finalizar descarga -> tb. posible gestionar con var config
    notnull_Referencia: boolean = true;
    notnull_Transporte: boolean = true;
    notnull_TipoVehiculo: boolean = true;
    notnull_Matricula: boolean = false;
    notnull_Conductor: boolean = false;
    notnull_Remolque: boolean = false;
    notnull_Contenedor: boolean = false;
    notnull_Precinto: boolean = false;
    faltan_datos: boolean = true;
  }