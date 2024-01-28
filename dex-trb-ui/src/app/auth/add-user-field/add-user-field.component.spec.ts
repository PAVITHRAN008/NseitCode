import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserFieldComponent } from './add-user-field.component';

describe('AddUserFieldComponent', () => {
  let component: AddUserFieldComponent;
  let fixture: ComponentFixture<AddUserFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
