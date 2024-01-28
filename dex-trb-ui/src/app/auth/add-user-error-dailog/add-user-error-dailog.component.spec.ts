import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserErrorDailogComponent } from './add-user-error-dailog.component';

describe('AddUserErrorDailogComponent', () => {
  let component: AddUserErrorDailogComponent;
  let fixture: ComponentFixture<AddUserErrorDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserErrorDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserErrorDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
