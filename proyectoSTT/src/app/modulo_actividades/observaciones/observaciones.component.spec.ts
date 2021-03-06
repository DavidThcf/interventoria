import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesComponent } from './observaciones.component';

describe('ObservacionesComponent', () => {
  let component: ObservacionesComponent;
  let fixture: ComponentFixture<ObservacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
