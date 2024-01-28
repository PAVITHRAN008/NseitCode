import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUserInputFieldComponent } from './report-user-input-field.component';

describe('ReportUserInputFieldComponent', () => {
  let component: ReportUserInputFieldComponent;
  let fixture: ComponentFixture<ReportUserInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportUserInputFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUserInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
