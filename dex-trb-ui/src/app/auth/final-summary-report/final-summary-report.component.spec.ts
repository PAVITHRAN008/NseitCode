import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalSummaryReportComponent } from './final-summary-report.component';

describe('FinalSummaryReportComponent', () => {
  let component: FinalSummaryReportComponent;
  let fixture: ComponentFixture<FinalSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalSummaryReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
