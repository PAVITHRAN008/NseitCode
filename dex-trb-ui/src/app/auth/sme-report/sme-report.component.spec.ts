import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeReportComponent } from './sme-report.component';

describe('SmeReportComponent', () => {
  let component: SmeReportComponent;
  let fixture: ComponentFixture<SmeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
