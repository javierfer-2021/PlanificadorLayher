import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConfiGlobal } from '../Utilidades/ConfiGlobal';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(){
    if (ConfiGlobal.autorizacion) {
      return true;
    } else {
      this.router.navigate(['']);
      ConfiGlobal.mensajeError = 'Tiene que iniciar sesión.';
      return false;
    }
  }

}
