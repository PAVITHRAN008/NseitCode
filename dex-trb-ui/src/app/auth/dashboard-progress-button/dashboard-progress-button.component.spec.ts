import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProgressButtonComponent } from './dashboard-progress-button.component';

describe('DashboardProgressButtonComponent', () => {
  let component: DashboardProgressButtonComponent;
  let fixture: ComponentFixture<DashboardProgressButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardProgressButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardProgressButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
