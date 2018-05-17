import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Servicios } from './services/servicios';
import { ServiciosGlobales } from './services/servicios-globales';
import { PersistenceModule } from 'angular-persistence';


import { AppComponent } from './app.component';
import { Modallogin } from './modulo_login/modal-login.component';
import { ModalRegister } from './modulo_registro/modal-register.component';
import { InicioView } from './modulo_inicio/inicio.component';
import { Mapa } from './modulo_mapa_publico/mapa.component';


import { AgmCoreModule } from '@agm/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './routing/app-routing.module';
import { ActividadModule } from './modulo_actividades/actividad-panel.module';
import { ProyectoModule } from './modulo_proyectos/proyecto-panel.module';
import { NewsComponentComponent } from './news-component/news-component.component';
import { ModuloRecuperacionComponent } from './modulo-recuperacion/modulo-recuperacion.component';
import { ModuloHelpComponent } from './modulo-help/modulo-help.component';

import { PublicBeneficiaryModule } from './modulo_public_beneficiary/public-beneficiary.module';


/* switch boostrap */

/* ----------------------- */


@NgModule({
  imports: [
    PublicBeneficiaryModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    PersistenceModule,
    ActividadModule,
    ProyectoModule,    
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBOeLL07vQ6T4XPjzxkY1lpbm9Z0nAymN8 ',
      libraries: ["places"]
    }),
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    Modallogin,
    ModalRegister,
    InicioView,
    Mapa,
    NewsComponentComponent,
    ModuloRecuperacionComponent,
    ModuloHelpComponent
  ],
  providers: [
    Servicios,
    ServiciosGlobales,
    ActividadModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
