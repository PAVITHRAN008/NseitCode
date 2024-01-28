import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLeftPanelComponent } from './login-left-panel.component';

describe('LoginLeftPanelComponent', () => {
  let component: LoginLeftPanelComponent;
  let fixture: ComponentFixture<LoginLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginLeftPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
