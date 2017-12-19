import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloHelpComponent } from './modulo-help.component';

describe('ModuloHelpComponent', () => {
  let component: ModuloHelpComponent;
  let fixture: ComponentFixture<ModuloHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuloHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
