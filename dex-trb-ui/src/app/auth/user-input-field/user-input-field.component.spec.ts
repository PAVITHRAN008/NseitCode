import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInputFieldComponent } from './user-input-field.component';

describe('UserInputFieldComponent', () => {
  let component: UserInputFieldComponent;
  let fixture: ComponentFixture<UserInputFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInputFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
