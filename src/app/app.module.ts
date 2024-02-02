import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
import { FrmLoginComponent } from './Pantallas/frm-login/frm-login.component';

// DevExtreme + AngularMaterial + SmartWeb
import { DevextremeModule } from './Modulos/DevExtreme/devextreme.module';
import { MaterialModule } from './Modulos/AngularMaterial/material.module';

// carga parametros dominio:puerto desde fichero config.json
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './Servicios/ConfiguracionService/config.service'

// Translate
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Componentes Viletel
import { BotonMenuComponent } from './Componentes/boton-menu/boton-menu.component';
import { CmpBotonIconoHrzComponent } from './Componentes/cmp-boton-icono-hrz/cmp-boton-icono-hrz.component';
import { CmpBotonIconoVertComponent } from './Componentes/cmp-boton-icono-vert/cmp-boton-icono-vert.component';
import { CmpBotonesPantallasComponent } from './Componentes/cmp-botones-pantallas/cmp-botones-pantallas.component';
import { CmpInfoGridComponent } from './Componentes/cmp-info-grid/cmp-info-grid.component';
import { CmpMatModalDialogComponent } from './Componentes/cmp-mat-modal-dialog/cmp-mat-modal-dialog.component';
import { CmpScrollAreaComponent } from './Componentes/cmp-scroll-area/cmp-scroll-area.component';
import { CmpTextAreaComponent } from './Componentes/cmp-text-area/cmp-text-area.component';
import { CmpTextBoxComponent } from './Componentes/cmp-text-box/cmp-text-box.component';
import { CmpDataGridComponent } from './Componentes/cmp-data-grid/cmp-data-grid.component';
import { FormsModule } from '@angular/forms';
import { FrmConexionesComponent } from './Pantallas/frm-conexiones/frm-conexiones.component';
import { FrmPlanificadorComponent } from './Pantallas/Planificador/frm-planificador/frm-planificador.component';
import { FrmPrincipalComponent } from './Pantallas/frm-principal/frm-principal.component';
import { FrmUsuarioBuscarComponent } from './Pantallas/Usuarios/frm-usuario-buscar/frm-usuario-buscar.component';
import { FrmUsuarioComponent } from './Pantallas/Usuarios/frm-usuario/frm-usuario.component';
import { FrmCompraBuscarComponent } from './Pantallas/Compras/frm-compra-buscar/frm-compra-buscar.component';
import { FrmCompraImportarComponent } from './Pantallas/Compras/frm-compra-importar/frm-compra-importar.component';
import { FrmArticulosStockComponent } from './Pantallas/Articulos/frm-articulos-stock/frm-articulos-stock.component';
import { FrmIncidenciaComponent } from './Pantallas/Incidencias/frm-incidencia/frm-incidencia.component';
import { FrmVentaImportarComponent } from './Pantallas/Ventas/frm-venta-importar/frm-venta-importar.component';
import { FrmVentaBuscarComponent } from './Pantallas/Ventas/frm-venta-buscar/frm-venta-buscar.component';
import { FrmVentaDetallesComponent } from './Pantallas/Ventas/frm-venta-detalles/frm-venta-detalles.component';
import { CmdSelectBoxComponent } from './Componentes/cmp-select-box/cmd-select-box.component';
import { FrmConfiguracionComponent } from './Pantallas/frm-configuracion/frm-configuracion.component';
import { FrmCompraDetallesComponent } from './Pantallas/Compras/frm-compra-detalles/frm-compra-detalles.component';
import { FrmImportarMaestrosComponent } from './Pantallas/Maestros/frm-importar-maestros/frm-importar-maestros.component';
import { FrmArticulosBuscarComponent } from './Pantallas/Articulos/frm-articulos-buscar/frm-articulos-buscar.component';
import { FrmFiltrosBuscarComponent } from './Pantallas/frm-filtros-buscar/frm-filtros-buscar.component';
import { FrmArticulosEditarComponent } from './Pantallas/Articulos/frm-articulos-editar/frm-articulos-editar.component';
import { FrmPlanificadorArticulosComponent } from './Pantallas/Planificador/frm-planificador-articulos/frm-planificador-articulos.component';
import { FrmPlanificadorUndComponent } from './Pantallas/Planificador/frm-planificador-und/frm-planificador-und.component';
import { FrmFamiliasComponent } from './Pantallas/Maestros/frm-familias/frm-familias.component';
import { FrmSubfamiliasComponent } from './Pantallas/Maestros/frm-subfamilias/frm-subfamilias.component';
import { FrmIncidenciaBuscarComponent } from './Pantallas/Incidencias/frm-incidencia-buscar/frm-incidencia-buscar.component';
import { FrmIncidenciaBuscarDocComponent } from './Pantallas/Incidencias/frm-incidencia-buscar-doc/frm-incidencia-buscar-doc.component';
import { FrmIncidenciaBuscarArtComponent } from './Pantallas/Incidencias/frm-incidencia-buscar-art/frm-incidencia-buscar-art.component';
import { FrmCompraLineasComponent } from './Pantallas/Compras/frm-compra-lineas/frm-compra-lineas.component';
import { FrmVentaLineasComponent } from './Pantallas/Ventas/frm-venta-lineas/frm-venta-lineas.component';
import { FrmImportarCsvComponent } from './Pantallas/Ventas/frm-importar-csv/frm-importar-csv.component';
import { FrmSimulacionPlanificadorComponent } from './Pantallas/Planificador/frm-simulacion-planificador/frm-simulacion-planificador.component';

export function HttpLoaderFactory(httpClient: HttpClient) { }

function initializeApp(appConfig: ConfigService) {
  return () => appConfig.loadConfig();
}
@NgModule({
  declarations: [
    AppComponent,
    FrmLoginComponent,
    BotonMenuComponent,
    CmpBotonIconoHrzComponent,
    CmpBotonIconoVertComponent,
    CmpBotonesPantallasComponent,
    CmpInfoGridComponent,
    CmpMatModalDialogComponent,
    CmpScrollAreaComponent,
    CmpTextAreaComponent,
    CmpTextBoxComponent,
    CmpDataGridComponent,
    FrmConexionesComponent,
    FrmPlanificadorComponent,
    FrmPrincipalComponent,
    FrmUsuarioBuscarComponent,
    FrmUsuarioComponent,
    FrmCompraBuscarComponent,
    FrmCompraImportarComponent,
    FrmArticulosStockComponent,
    FrmIncidenciaComponent,
    FrmVentaImportarComponent,
    FrmVentaBuscarComponent,
    FrmVentaDetallesComponent,
    CmdSelectBoxComponent,
    FrmConfiguracionComponent,
    FrmCompraDetallesComponent,
    FrmImportarMaestrosComponent,
    FrmArticulosBuscarComponent,
    FrmFiltrosBuscarComponent,
    FrmArticulosEditarComponent,
    FrmPlanificadorArticulosComponent,
    FrmPlanificadorUndComponent,
    FrmFamiliasComponent,
    FrmSubfamiliasComponent,
    FrmIncidenciaBuscarComponent,
    FrmIncidenciaBuscarDocComponent,
    FrmIncidenciaBuscarArtComponent,
    FrmCompraLineasComponent,
    FrmVentaLineasComponent,
    FrmImportarCsvComponent,
    FrmSimulacionPlanificadorComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DevextremeModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    },    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
