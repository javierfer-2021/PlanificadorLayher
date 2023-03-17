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
    Perfil: number;
    IdPersonal: number;
  }
  

  export class Perfil {
    IdPerfil: number;
    NombrePrefil: string;
  }