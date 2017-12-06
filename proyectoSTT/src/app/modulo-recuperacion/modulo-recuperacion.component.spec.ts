import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRecuperacionComponent } from './modulo-recuperacion.component';

describe('ModuloRecuperacionComponent', () => {
  let component: ModuloRecuperacionComponent;
  let fixture: ComponentFixture<ModuloRecuperacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloRecuperacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
