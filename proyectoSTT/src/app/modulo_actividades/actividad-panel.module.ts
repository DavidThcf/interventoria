import { NgModule, LOCALE_ID }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule }    from '@angular/forms';
import { ActividadPanel }   from './actividad-panel.component';
import { RegistroActividad }  from './modulo_registro_actividad/registro_actividad.component';
//import { MultimediaModule }        from './modulo_multimedia/multimedia.module';
import { Multimedia }   from './modulo_multimedia/multimedia.component';
import { Categorias }   from './modulo_categorias/categorias.component';
import { Mapa }   from './modulo_mapa/mapa.component';
import { SubActividadPanel }   from './modulo_subactividad/subactividad-panel.component';
import { RegistroMultimedia }  from './modulo_multimedia/modulo-registro-multimedia/registro-multimedia.component';


import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';

import { ServiciosGlobalesActividades} from './servicios-globales-actividades';
import { ActivityTableComponent } from './component-activity-table/component-activity-table.component';
import { AssignUserComponent } from './assign-user/assign-user.component';
import { RemarksComponent } from './remarks/remarks.component';
import { ReportComponent } from './report/report.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { ChartComponentComponent } from './chart-component/chart-component.component';
import { AutoReportComponent } from './auto-report/auto-report.component';





@NgModule({
  imports: [
  CommonModule,
  FormsModule,
  ChartsModule,
  AgmCoreModule,
  ReactiveFormsModule
  ],
  declarations: [
  ActividadPanel,
  RegistroActividad,
  Multimedia,
  RegistroMultimedia,
  Categorias,
  Mapa,
  SubActividadPanel,
  ActivityTableComponent,
  AssignUserComponent,
  RemarksComponent,
  ReportComponent,
  ObservacionesComponent,
  ChartComponentComponent,
  AutoReportComponent,
  ],
  providers: [  { provide: LOCALE_ID, useValue: "es-CO" },ServiciosGlobalesActividades ]
})
export class ActividadModule {}
