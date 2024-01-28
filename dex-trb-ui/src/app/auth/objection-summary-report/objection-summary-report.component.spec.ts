import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionSummaryReportComponent } from './objection-summary-report.component';

describe('ObjectionSummaryReportComponent', () => {
  let component: ObjectionSummaryReportComponent;
  let fixture: ComponentFixture<ObjectionSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
