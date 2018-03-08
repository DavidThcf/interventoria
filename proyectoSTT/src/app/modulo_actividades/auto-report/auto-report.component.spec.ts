import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoReportComponent } from './auto-report.component';

describe('AutoReportComponent', () => {
  let component: AutoReportComponent;
  let fixture: ComponentFixture<AutoReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
