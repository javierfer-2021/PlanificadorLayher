import { Component, OnInit, Input} from '@angular/core';
import { ConfiGlobal } from '../../Utilidades/ConfiGlobal';
import { Permiso } from '../../Clases/Permiso';
import { BotonMenu } from '../../Clases/Componentes/BotonMenu';

@Component({
  selector: 'app-boton-menu',
  templateUrl: './boton-menu.component.html',
  styleUrls: ['./boton-menu.component.css']
})
export class BotonMenuComponent implements OnInit {

  @Input() btnMenu: BotonMenu;

  constructor() { }

  ngOnInit(): void {
    //let dtBoton: Array<Permiso> = ConfiGlobal.Permisos.filter(permiso => permiso.Habilitado === false && this.btnMenu.nombre === permiso.Control);
    let dtBoton: Array<Permiso> = []

    if(dtBoton != null && dtBoton.length == 1){
      this.btnMenu.desactivado = true;
    }
  }

  ejecutar() {
    this.btnMenu.accion();
  }

}
