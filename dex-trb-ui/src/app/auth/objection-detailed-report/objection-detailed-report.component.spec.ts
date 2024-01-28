import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionDetailedReportComponent } from './objection-detailed-report.component';

describe('ObjectionDetailedReportComponent', () => {
  let component: ObjectionDetailedReportComponent;
  let fixture: ComponentFixture<ObjectionDetailedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionDetailedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionDetailedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
