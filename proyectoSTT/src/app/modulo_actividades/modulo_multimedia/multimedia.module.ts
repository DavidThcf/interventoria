import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { RegistroMultimedia }  from './modulo-registro-multimedia/registro-multimedia.component';


import { ChartsModule } from 'ng2-charts';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule,
    AgmCoreModule
  ],
  declarations: [  	
    RegistroMultimedia
  ],
  providers: [ ]
})
export class MultimediaModule {}