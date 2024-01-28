import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionApprovalComponent } from './objection-approval.component';

describe('ObjectionApprovalComponent', () => {
  let component: ObjectionApprovalComponent;
  let fixture: ComponentFixture<ObjectionApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectionApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
