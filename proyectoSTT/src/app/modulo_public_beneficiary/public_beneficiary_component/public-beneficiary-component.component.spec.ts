import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBeneficiaryComponentComponent } from './public-beneficiary-component.component';

describe('PublicBeneficiaryComponentComponent', () => {
  let component: PublicBeneficiaryComponentComponent;
  let fixture: ComponentFixture<PublicBeneficiaryComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicBeneficiaryComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicBeneficiaryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
