import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionTrackingComponent } from './objection-tracking.component';

describe('ObjectionTrackingComponent', () => {
  let component: ObjectionTrackingComponent;
  let fixture: ComponentFixture<ObjectionTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionTrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
