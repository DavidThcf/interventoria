import { NgModule, LOCALE_ID }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule,ReactiveFormsModule }    from '@angular/forms';

import { PublicBeneficiaryComponent } from './public_beneficiary_component/public-beneficiary-component.component';
import { DetailsBeneficiaryComponent } from './details-beneficiary/details-beneficiary.component';

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
  	PublicBeneficiaryComponent,
  	DetailsBeneficiaryComponent
  ],
  providers: [ 
  ]
})
export class PublicBeneficiaryModule {}