import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentActivityTableComponent } from './component-activity-table.component';

describe('ComponentActivityTableComponent', () => {
  let component: ComponentActivityTableComponent;
  let fixture: ComponentFixture<ComponentActivityTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentActivityTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentActivityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
