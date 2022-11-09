import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './Guards/auth.guard';

import { FrmLoginComponent } from './Pantallas/frm-login/frm-login.component';
import { FrmPlanificadorComponent } from './Pantallas/frm-planificador/frm-planificador.component';


const routes: Routes = [
  { path: '', component: FrmLoginComponent },
  { path: 'planificador', component: FrmPlanificadorComponent/* , canActivate: [AuthGuard] */  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
