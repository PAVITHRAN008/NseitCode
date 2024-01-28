import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';

export interface tabledataone {
  questions: string;
  smeName: string;
  status: string;
}
const ELEMENT_DATA: tabledataone[] = [
  { questions: 'Hydrogen', smeName: '001', status: 'Approved' },
  { questions: 'Helium', smeName: '002', status: 'Approved' },
  { questions: 'Lithium', smeName: '003', status: 'Yet to approve' },
  { questions: 'Beryllium', smeName: '004', status: 'Rejected' },
  { questions: 'Boron', smeName: '005', status: 'Approved' },
  { questions: 'Carbon', smeName: '0017', status: 'Approved' }
];
@Component({
  selector: 'app-objection-tracking',
  templateUrl: './objection-tracking.component.html',
  styleUrls: ['./objection-tracking.component.scss']
})
export class ObjectionTrackingComponent implements OnInit {

  dataSource = new MatTableDataSource<tabledataone>();
  displayedColumnsOne: string[] = ['sNo', 'questions', 'smeName', 'status'];
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild('TableOneSort', { static: true })
  tableOneSort!: MatSort;
  selection = new SelectionModel<tabledataone>(true, []);
  userSearchInputs: any = {};
  selectedSubject!: string;
  currentUserRole: any;

  constructor(private router: Router, private componentInteraction: ComponentInteractionService) {
    this.dataSource = new MatTableDataSource;
  }

  ngOnInit(): void {
    this.currentUserRole = this.componentInteraction.getAttribute('currentUserRole');
    this.dataSource.data = ELEMENT_DATA;
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource.sort = this.tableOneSort;
  }
  applyFilterOne(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  getChildFormData(event: any) {
    this.selectedSubject = event.subject;
  }
  viewObjectionDetails(rowDetails: any) {
    this.componentInteraction.setData('ObjectionApprovalQuestionId', 152)
    this.navToObjectionTrackStatus()
  }
  navToObjectionTrackStatus() {
    this.router.navigate(['/objection-tracking-status'])
  }
}