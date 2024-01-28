import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTitleHeaderComponent } from './table-title-header.component';

describe('TableTitleHeaderComponent', () => {
  let component: TableTitleHeaderComponent;
  let fixture: ComponentFixture<TableTitleHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTitleHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableTitleHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
