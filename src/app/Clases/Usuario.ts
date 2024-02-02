export class Usuario {
    IdUsuario: number;
    NombreUsuario: string;
    Email: string;   
    Login: string;
    Password: string;
    IdIdioma: number;
    NombreIdioma: string;
    FechaAlta: Date;
    FechaBaja: Date;
    Baja: boolean;    
    Conectado: boolean;
    Administrador: boolean;
    VerAlmacenes : boolean;
    idAlmacenDefecto: number;
    NombreAlmacenDefecto: String;
    Skin: string;
    IdPerfil: number;
    NombrePerfil: string;
    IdPersonal: number;
    NotificacionesEmail: boolean;
  }
  

  export class Perfil {
    IdPerfil: number;
    NombrePerfil: string;
    Abreviatura: string;
    Descripcion: string;
    Administrador: boolean;
    Defecto: boolean;
    Activo: boolean;
  }
  