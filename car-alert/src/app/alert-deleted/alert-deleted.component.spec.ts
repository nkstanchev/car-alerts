import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDeletedComponent } from './alert-deleted.component';

describe('AlertDeletedComponent', () => {
  let component: AlertDeletedComponent;
  let fixture: ComponentFixture<AlertDeletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDeletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
