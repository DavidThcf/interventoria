import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { ProyectoPanel }   from './proyecto-panel.component';
import { RegistroProyecto }  from './modulo_registro_proyecto/registro_proyecto.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule    
  ],
  declarations: [
  	ProyectoPanel,
    RegistroProyecto
  ],
  providers: [ ]
})
export class ProyectoModule {}