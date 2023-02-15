export class Usuario {
    IdUsuario: number;
    NombreUsuario: string;
    IdPerfil: number;
    NombrePerfil: string;
    Login: string;
    Password: number;
    IdIdioma: number;
    NombreIdioma: string;
    Email: string;
    Activo: boolean;
    Conectado: boolean;
    FechaAlta: Date;
  }
  

  export class Perfil {
    IdPerfil: number;
    NombrePrefil: string;
  }