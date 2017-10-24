import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponentComponent } from './news-component.component';

describe('NewsComponentComponent', () => {
  let component: NewsComponentComponent;
  let fixture: ComponentFixture<NewsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
