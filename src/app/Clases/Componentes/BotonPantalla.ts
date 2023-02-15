import { TipoBoton } from "../../Enumeraciones/TipoBoton";

export class BotonPantalla {

    constructor()
    {
      this.visible = true;
      this.activo = true;
    }
  
  
    icono: string;
    texto: string;
    posicion: number;
    accion: () => void;
    tipo: TipoBoton;
    visible?: boolean = true;
    activo?: boolean = true;
  }