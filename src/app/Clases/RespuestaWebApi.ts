import { ResultadoWebApi } from './../Enumeraciones/ResultadoWebApi';

export class RespuestaWebApi {
    usuario: number;
    token?: string;
    resultado: ResultadoWebApi;
    nError: number;
    datos: any;
  }