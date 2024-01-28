import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NAVIGATION_URL_PATHS } from 'src/app/utils/constants';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { EditInputFieldComponent } from '../edit-input-field/edit-input-field.component';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  searchForm!: FormGroup
  userId: any;
  userSearchInputs: any;
  selectedSMEId: any;
  selectedSubject!: string;
  tabledata: any = [];
  displayedColumns: string[] = ['id', 'subject', 'identityNumber', 'firstName', 'valdityInDays', 'userId', 'password', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  private tablePaginator!: MatPaginator;
  private tableSort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.tableSort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.tablePaginator = mp;
    this.setDataSourceAttributes();
  }
  loader: any = true;
  noRecordMessage: any = false;

  constructor(private componentInteraction: ComponentInteractionService, private dialog: MatDialog, private formBuilder: FormBuilder, private globalService: GlobalUseService, private router: Router, private snackBService: SnackbarService, private http: HttpService, private dailog: MatDialog) {
    this.userSearchInputs = this.componentInteraction.getData()
  }
  ngOnInit() {
    this.loader = true;
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }
  setDataSourceAttributes() {
    if (this.tablePaginator && this.tableSort) {
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.tableSort;
    }
  }
  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  deleteUser(row: any, buttonTextSubmit: string, buttonTextCancel: string) {
    this.userId = row.userId;
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        paramDetails: this.userId,
        status: "DELETE",
        title: 'Delete User',
        message: 'Are you sure want to Delete User?',
        buttonText: {
          cancel: buttonTextCancel,
          ok: buttonTextSubmit,
        },
      }
    })
    dialogRef.afterClosed().subscribe((val: any) => {
      if (val) {
        setTimeout(() => {
          this.getUsersDetailsBasedOnSubject('event', true)
        }, 3000);
      }
    })
  }
  getAllUsers() {
    this.noRecordMessage = false;
    this.tabledata = [];
    let ELEMENT_DATA: any = [];
    this.loader = true;
    this.http.getAllUsersDetails().subscribe({
      next: (res) => {
        if (res.statusCode == 'SUC-001') {
          this.loader = false;
          this.tabledata = res.responseContent
          this.noRecordMessage = (this.tabledata.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.responseContent.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, expiryDate: val.expiryDate, firstName: val.firstName,
                identityNumber: val.identityNumber, password: val.password, userId: val.userId,
                valdityInDays: val.valdityInDays, userCrteDate: val.userCrteDate,
                userUpdtDt: val.userUpdtDt
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.tablePaginator;
            this.dataSource.sort = this.tableSort
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
  getUsersDetailsBasedOnSubject(event: any, isReload?: any) {
    this.noRecordMessage = false;
    this.tabledata = [];
    this.loader = true;
    let ELEMENT_DATA: any = []
    let requestParam: any = {}
    if (isReload) {
      requestParam.subject = this.selectedSubject ? this.selectedSubject : '';
      requestParam.smeId = this.selectedSMEId ? this.selectedSMEId : '';
    }
    else {
      requestParam.subject = event.subject
      requestParam.smeId = event.smeId
    }
    if(requestParam.subject == ''&& requestParam.smeId == ''){
      this.getAllUsers()
    }
    this.http.getUsersBasedOnSubject(requestParam.subject, requestParam.smeId).subscribe({
      next: (res: any) => {
        if (res.statusCode == 'SUC-001') {
          this.loader = false;
          this.tabledata = res.responseContent;
          this.noRecordMessage = (this.tabledata.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.responseContent.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, expiryDate: val.expiryDate, firstName: val.firstName,
                identityNumber: val.identityNumber, password: val.password, userId: val.userId,
                valdityInDays: val.valdityInDays, userCrteDate: val.userCrteDate,
                userUpdtDt: val.userUpdtDt
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.tablePaginator;
            this.dataSource.sort = this.tableSort;
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
  openEditDialog(row: any) {
    let dailogref = this.dailog.open(EditInputFieldComponent, {
      width: "90%",
      data: row
    })
    dailogref.afterClosed().subscribe((val: any) => {
      if (val == true) {
        this.getUsersDetailsBasedOnSubject('event', true)
      }
    })
  }
  refresh(event: any) {
    if (event == 'refresh') {
      this.getAllUsers()
      this.searchForm.reset()
    }
  }
  getChildFormData(event?: any) {
    if (event) {
      this.selectedSubject = event.subject;
      this.selectedSMEId = event.smeId;
      this.getUsersDetailsBasedOnSubject(event)
    }
    this.refresh(event)
  }
  navigateToAddUser() {
    this.router.navigate(NAVIGATION_URL_PATHS.ADD_USER);
  }
  importAsXlsx() {
    this.matTableExporter.exportTable('xlsx', { fileName: this.globalService.getFileName('Export').fileName, sheet: this.globalService.getFileName('Export').sheetName })
  }
}


