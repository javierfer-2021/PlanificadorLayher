export class Usuario {
    IdUsuario: number;
    Nombre: string;
    Apellidos: string;
    IdPerfil: number;
    NombrePerfil: string;
    Login: string;
    Password: number;
    Activo: boolean;
    FechaAlta: Date;
  }

  export class Perfil {
    IdPerfil: number;
    NombrePrefil: string;
  }