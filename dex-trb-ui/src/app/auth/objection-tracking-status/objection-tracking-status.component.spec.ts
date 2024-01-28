import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionTrackingStatusComponent } from './objection-tracking-status.component';

describe('ObjectionTrackingStatusComponent', () => {
  let component: ObjectionTrackingStatusComponent;
  let fixture: ComponentFixture<ObjectionTrackingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionTrackingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionTrackingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
