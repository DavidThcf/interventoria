import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioView } from '../modulo_inicio/inicio.component';
import { ProyectoPanel } from '../modulo_proyectos/proyecto-panel.component';
import { ActividadPanel } from '../modulo_actividades/actividad-panel.component';
import { Mapa } from '../modulo_mapa_publico/mapa.component';
import { NewsComponentComponent } from '../news-component/news-component.component';
import { ModuloRecuperacionComponent } from '../modulo-recuperacion/modulo-recuperacion.component';
import { ModuloHelpComponent } from '../modulo-help/modulo-help.component';
import { PublicBeneficiaryComponent } from '../modulo_public_beneficiary/public_beneficiary_component/public-beneficiary-component.component';
import { DetailsBeneficiaryComponent } from '../modulo_public_beneficiary/details-beneficiary/details-beneficiary.component';
const routes: Routes = [
  { path: '', component: InicioView },
  { path: 'administrador', component: ProyectoPanel },
  { path: 'mapa', component: Mapa },
  { path: 'pb_list', component: PublicBeneficiaryComponent },
  { path: 'pb_detail', component: DetailsBeneficiaryComponent },
  { path: 'actividades', component: ActividadPanel },
  { path: 'proyectos', component: ActividadPanel },
  { path: 'novedades', component: NewsComponentComponent },
  { path: 'recuperacion', component: ModuloRecuperacionComponent },
  { path: 'ayuda', component: ModuloHelpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }