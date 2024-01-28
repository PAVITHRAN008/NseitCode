import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectionTableCandidateComponent } from './objection-table-candidate.component';

describe('ObjectionTableCandidateComponent', () => {
  let component: ObjectionTableCandidateComponent;
  let fixture: ComponentFixture<ObjectionTableCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObjectionTableCandidateComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectionTableCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
