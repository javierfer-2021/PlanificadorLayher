import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Guards/auth.guard';

import { FrmLoginComponent } from './Pantallas/frm-login/frm-login.component';
import { FrmPrincipalComponent } from './Pantallas/frm-principal/frm-principal.component';
import { FrmPlanificadorComponent } from './Pantallas/Planificador/frm-planificador/frm-planificador.component';
import { FrmPlanificadorArticulosComponent } from './Pantallas/Planificador/frm-planificador-articulos/frm-planificador-articulos.component';
import { FrmCompraBuscarComponent } from './Pantallas/Compras/frm-compra-buscar/frm-compra-buscar.component';
import { FrmCompraImportarComponent } from './Pantallas/Compras/frm-compra-importar/frm-compra-importar.component';
import { FrmCompraDetallesComponent } from './Pantallas/Compras/frm-compra-detalles/frm-compra-detalles.component';
import { FrmVentaBuscarComponent } from './Pantallas/Ventas/frm-venta-buscar/frm-venta-buscar.component';
import { FrmVentaImportarComponent } from './Pantallas/Ventas/frm-venta-importar/frm-venta-importar.component';
import { FrmVentaDetallesComponent } from './Pantallas/Ventas/frm-venta-detalles/frm-venta-detalles.component';
import { FrmUsuarioBuscarComponent } from './Pantallas/Usuarios/frm-usuario-buscar/frm-usuario-buscar.component';
import { FrmUsuarioComponent } from './Pantallas/Usuarios/frm-usuario/frm-usuario.component';
import { FrmArticulosStockComponent } from './Pantallas/Articulos/frm-articulos-stock/frm-articulos-stock.component';
import { FrmIncidenciaBuscarComponent } from './Pantallas/Incidencias/frm-incidencia-buscar/frm-incidencia-buscar.component';
import { FrmIncidenciaComponent } from './Pantallas/Incidencias/frm-incidencia/frm-incidencia.component';
import { FrmConfiguracionComponent } from './Pantallas/frm-configuracion/frm-configuracion.component';
import { FrmImportarMaestrosComponent } from './Pantallas/Maestros/frm-importar-maestros/frm-importar-maestros.component';
import { FrmFamiliasComponent } from './Pantallas/Maestros/frm-familias/frm-familias.component';
import { FrmSubfamiliasComponent } from './Pantallas/Maestros/frm-subfamilias/frm-subfamilias.component';

const routes: Routes = [
  { path: '', component: FrmLoginComponent },
  { path: 'inicio', component: FrmPrincipalComponent, canActivate: [AuthGuard] },
  
  { path: 'venta_buscar', component: FrmVentaBuscarComponent, canActivate: [AuthGuard] },
  { path: 'venta_importar', component: FrmVentaImportarComponent, canActivate: [AuthGuard] },
  { path: 'venta_detalle', component: FrmVentaDetallesComponent, canActivate: [AuthGuard] },

  { path: 'compra_buscar', component: FrmCompraBuscarComponent, canActivate: [AuthGuard] },
  { path: 'compra_importar', component: FrmCompraImportarComponent, canActivate: [AuthGuard] },
  { path: 'compra_detalle', component: FrmCompraDetallesComponent, canActivate: [AuthGuard] }, 
  
  { path: 'incidencia-buscar', component: FrmIncidenciaBuscarComponent, canActivate: [AuthGuard] },
  { path: 'incidencia', component: FrmIncidenciaComponent, canActivate: [AuthGuard] },

  { path: 'articulos_stock', component: FrmArticulosStockComponent, canActivate: [AuthGuard] },

  { path: 'planificador', component: FrmPlanificadorComponent, canActivate: [AuthGuard] },
  { path: 'planificador_articulos', component: FrmPlanificadorArticulosComponent, canActivate: [AuthGuard] },
  
  { path: 'usuario_buscar', component: FrmUsuarioBuscarComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: FrmUsuarioComponent, canActivate: [AuthGuard] }, 
  { path: 'configuracion', component: FrmConfiguracionComponent, canActivate: [AuthGuard] },
  { path: 'importar_maestros', component: FrmImportarMaestrosComponent, canActivate: [AuthGuard] },
  { path: 'maestro-familias', component: FrmFamiliasComponent, canActivate: [AuthGuard] },
  { path: 'maestro-subfamilias', component: FrmSubfamiliasComponent, canActivate: [AuthGuard] },
    
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
