import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Componentes
import { FrmLoginComponent } from './Pantallas/frm-login/frm-login.component';

// DevExtreme + AngularMaterial + SmartWeb
import { DevextremeModule } from './modulos/devextreme/devextreme.module';
import { MaterialModule } from './modulos/AngularMaterial/material.module';

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
import { FrmPlanificadorComponent } from './Pantallas/frm-planificador/frm-planificador.component';
import { FrmPrincipalComponent } from './Pantallas/frm-principal/frm-principal.component';
import { FrmPruebasComponent } from './Pantallas/frm-pruebas/frm-pruebas.component';
import { FrmOfertaImportarComponent } from './Pantallas/frm-oferta-importar/frm-oferta-importar.component';
import { FrmOfertaBuscarComponent } from './Pantallas/frm-oferta-buscar/frm-oferta-buscar.component';
import { FrmCargarOfertaComponent } from './Pantallas/frm-cargar-oferta/frm-cargar-oferta.component';
import { FrmOfertaDetallesComponent } from './Pantallas/frm-oferta-detalles/frm-oferta-detalles.component';
import { FrmUsuarioBuscarComponent } from './Pantallas/Usuarios/frm-usuario-buscar/frm-usuario-buscar.component';
import { FrmUsuarioComponent } from './Pantallas/Usuarios/frm-usuario/frm-usuario.component';
import { FrmCompraBuscarComponent } from './Pantallas/Compras/frm-compra-buscar/frm-compra-buscar.component';
import { FrmCompraImportarComponent } from './Pantallas/Compras/frm-compra-importar/frm-compra-importar.component';
import { FrmArticulosStockComponent } from './Pantallas/frm-articulos-stock/frm-articulos-stock.component';
import { FrmIncidenciaComponent } from './Pantallas/frm-incidencia/frm-incidencia.component';
import { FrmVentasImportarComponent } from './Pantallas/Ventas/frm-ventas-importar/frm-ventas-importar.component';
import { FrmVentaBuscarComponent } from './Pantallas/Ventas/frm-venta-buscar/frm-venta-buscar.component';
import { FrmVentaDetallesComponent } from './Pantallas/Ventas/frm-venta-detalles/frm-venta-detalles.component';

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
    FrmPruebasComponent,
    FrmOfertaImportarComponent,
    FrmOfertaBuscarComponent,
    FrmCargarOfertaComponent,
    FrmOfertaDetallesComponent,
    FrmUsuarioBuscarComponent,
    FrmUsuarioComponent,
    FrmCompraBuscarComponent,
    FrmCompraImportarComponent,
    FrmArticulosStockComponent,
    FrmIncidenciaComponent,
    FrmVentasImportarComponent,
    FrmVentaBuscarComponent,
    FrmVentaDetallesComponent

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
