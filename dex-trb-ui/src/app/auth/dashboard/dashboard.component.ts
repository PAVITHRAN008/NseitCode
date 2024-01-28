import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpService } from 'src/app/services/http.service';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { USER_ROLES } from 'src/app/utils/constants';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSMERole = false;
  isAdminRole = false;
  // table one
  @ViewChild('exporterOne') exporterOne!: MatTableExporterDirective;
  @ViewChild('exporterTwo') exporterTwo!: MatTableExporterDirective;
  tableOneData: any = []
  displayedColumnsOne: string[] = ['id', 'subject', 'uniqueQuestions', 'totalQuestions', 'approved', 'rejected', 'pendingApproval', 'pendingAllocation'];
  dataSourceOne!: MatTableDataSource<any>;
  tableTwoData: any = []
  displayedColumnsTwo: string[] = ['id', 'subject', 'smeName', 'allocatedQuestions', 'approved', 'rejected', 'pendingApproval', 'expiryDays']
  dataSourceTwo!: MatTableDataSource<any>;
  public TableOnePaginator!: MatPaginator;
  public TableOneMatSort!: MatSort;
  public TableTwoPaginator!: MatPaginator;
  public TableTwoMatSort!: MatSort;
  @ViewChild('TableOnePaginator') set matPaginatorOne(mp1: MatPaginator) {
    this.TableOnePaginator = mp1;
    this.setDataSourceAttributes();
  }
  @ViewChild('TableOneMatSort') set matSortOne(ms1: MatSort) {
    this.TableOneMatSort = ms1;
    this.setDataSourceAttributes();
  }
  @ViewChild('TableTwoPaginator') set matPaginatorTwo(mp2: MatPaginator) {
    this.TableTwoPaginator = mp2;
    this.setDataSourceAttributes();
  }
  @ViewChild('TableTwoMatSort') set matSortTwo(ms2: MatSort) {
    this.TableTwoMatSort = ms2;
    this.setDataSourceAttributes();
  }
  loader: any = true;
  loaderOne: any = true;
  noRecordMessage: any = false;
  constructor(private httpService: HttpService,private snackBService: SnackbarService, private globalService: GlobalUseService, private componentInteraction: ComponentInteractionService) {
  }

  ngOnInit(): void {
    this.loader = true;
    this.loaderOne = true;
    let role = this.componentInteraction.getAttribute('currentUserRole');
    (role == USER_ROLES.ADMIN) ? this.isAdminRole = true : this.isSMERole = true;
    let name = this.componentInteraction.getAttribute('name')
    if (role == "SME") {
      this.getParticularSmeDetails(name);
    }
    else {
      this.getAllSubjectDetails();
      this.getAllSmeDetails();
    }
  }
  setDataSourceAttributes() {
    if (this.TableOnePaginator && this.TableOneMatSort) {
      this.dataSourceOne.paginator = this.TableOnePaginator;
      this.dataSourceOne.sort = this.TableOneMatSort;
    }
    if (this.TableTwoPaginator && this.TableTwoMatSort) {
      this.dataSourceTwo.paginator = this.TableTwoPaginator;
      this.dataSourceTwo.sort = this.TableTwoMatSort;
    }
  }
  applyFilterOne(event: any) {
    this.dataSourceOne.filter = event.target.value.trim().toLowerCase();
  }
  applyFilterTwo(event: any) {
    this.dataSourceTwo.filter = event.target.value.trim().toLowerCase();
  }
  getAllSubjectDetails() {
    this.noRecordMessage = false;
    this.tableOneData = [];
    this.loaderOne = true;
    let ELEMENT_DATA: any = []
    this.httpService.getSubjectDetils().subscribe({
      next: (res) => {
        if (res.statuscode == "SUCC_000") {
          this.loaderOne = false;
          this.tableOneData = res.dashBoardBySubject;
          this.noRecordMessage = (this.tableOneData.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.dashBoardBySubject.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, approved: val.approved, pendingAllocation: val.pendingAllocation, pendingApproval: val.pendingApproval,
                rejected: val.rejected, totalQuestions: val.totalQuestions, uniqueQuestions: val.uniqueQuestions
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSourceOne = new MatTableDataSource(ELEMENT_DATA);
            this.dataSourceOne.paginator = this.TableOnePaginator;
            this.dataSourceOne.sort = this.TableOneMatSort;
          }
        }
        else {
          this.noRecordMessage = true;
          this.loaderOne = false;
        }
      }
    })
  }
  getAllSmeDetails() {
    this.noRecordMessage = false;
    this.tableTwoData = [];
    let ELEMENT_DATA: any = []
    this.loader = true;
    this.httpService.getSmeDetails().subscribe({
      next: (res) => {
        if (res.statuscode == "SUCC_000") {
          this.loader = false;
          this.tableTwoData = res.dashBoardBySme;
          this.noRecordMessage = (this.tableTwoData.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.dashBoardBySme.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, smeName: val.smeName, approved: val.approved, pendingApproval: val.pendingApproval,
                rejected: val.rejected, allocatedQuestions: val.allocatedQuestions, expiryDays: val.expiryDays
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSourceTwo = new MatTableDataSource(ELEMENT_DATA);
            this.dataSourceTwo.paginator = this.TableTwoPaginator;
            this.dataSourceTwo.sort = this.TableTwoMatSort;
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
  getParticularSmeDetails(name: any) {
    this.noRecordMessage = false;
    this.tableTwoData = [];
    let ELEMENT_DATA: any = []
    this.loader = true;
    this.httpService.getIndividualSmeDetails(name).subscribe({
      next: (res) => {
        if (res.statuscode == "SUCC_000") {
          this.loader = false;
          this.tableTwoData = res.dashBoardBySme;
          this.noRecordMessage = (this.tableTwoData.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.dashBoardBySme.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, smeName: val.smeName, approved: val.approved, pendingApproval: val.pendingApproval,
                rejected: val.rejected, allocatedQuestions: val.allocatedQuestions, expiryDays: val.expiryDays
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSourceTwo = new MatTableDataSource(ELEMENT_DATA);
            this.dataSourceTwo.paginator = this.TableTwoPaginator;
            this.dataSourceTwo.sort = this.TableTwoMatSort;
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
  importAsXlsxOne() {
    this.exporterOne.exportTable('xlsx', { fileName: this.globalService.getFileName('Export').fileName, sheet: this.globalService.getFileName('Export').sheetName })
  }
  importAsXlsxTwo() {
    this.exporterTwo.exportTable('xlsx', { fileName: this.globalService.getFileName('Export').fileName, sheet: this.globalService.getFileName('Export').sheetName })
  }
}
