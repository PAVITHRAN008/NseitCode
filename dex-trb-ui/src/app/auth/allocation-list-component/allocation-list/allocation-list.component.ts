import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AddUserDialogComponent } from '../../add-user-dialog/add-user-dialog.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { FormBuilder, FormGroup } from '@angular/forms';
export interface allocationTableData {
  masterQP: string;
  date: string;
  batch: string;
  mdmName: string;
  questions: string;
  smeName: string;
  status: string;
}

export interface allocation {
  userAllocation: any[]
}
@Component({
  selector: 'app-allocation-list',
  templateUrl: './allocation-list.component.html',
  styleUrls: ['./allocation-list.component.scss']
})
export class AllocationListComponent implements OnInit {
  searchForm!: FormGroup
  dataSource !: MatTableDataSource<any>;
  elementData: any;
  displayedColumnsOne: string[] = ['checkBox', 'sNo', 'date', 'batch', 'mdmName', 'masterQP', 'questions', 'questionImage', 'smeName', 'status'];
  selection = new SelectionModel<allocationTableData>(true, []);
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  private tableOnePaginator!: MatPaginator;
  private tableOneSort!: MatSort;
  items: any = [];
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.tableOneSort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.tableOnePaginator = mp;
    this.setDataSourceAttributes();
  }
  questionIds: any = []
  userSearchInputs: any = {};
  selectedSubject!: string;
  userAllocation: any = {};
  tableData: any = [];
  requestDataStoredArray: any = [];
  selectedSMEId: any;
  selectedStatus: any;
  selectedExamName: any;
  selectedDate: any;
  selectedBatch: any;
  loader: any = true;
  noRecordMessage: any = false;
  paginateArray: any = [3, 5, 10, 25, 100];
  currentPageSize: any;

  constructor(private snackBar: SnackbarService, private formBuilder: FormBuilder, private globalService: GlobalUseService, private dialog: MatDialog, private router: Router, private httpService: HttpService, private componentInteraction: ComponentInteractionService) {
  }

  ngOnInit(): void {
    this.currentPageSize = this.componentInteraction.getAttribute('currentPageSize') ? this.componentInteraction.getAttribute('currentPageSize') : this.paginateArray[0];
    this.loader = true;
    this.userAllocation = {}
    this.searchForm = this.formBuilder.group({
      search: ['']
    });

  }
  setDataSourceAttributes() {
    if (this.tableOnePaginator && this.tableOneSort) {
      this.dataSource.paginator = this.tableOnePaginator;
      this.dataSource.sort = this.tableOneSort;
    }
  }
  importAsXlsx() {
    this.matTableExporter.exportTable('xlsx', { fileName: this.globalService.getFileName(this.selectedSubject).fileName, sheet: this.globalService.getFileName(this.selectedSubject).sheetName })
  }
  selectRow(rowDetails: any, event: any) {
    let newObj = {}
    if (event.checked) {
      if (this.userAllocation.userAllocation && this.userAllocation?.userAllocation.length != 0) {
        this.userAllocation["userAllocation"].push(rowDetails)
      }
      else {
        newObj = rowDetails
        this.userAllocation["userAllocation"] = [newObj]
      }
    }
    else {
      this.deleteUserAllocationArray(rowDetails.objectionQuestionNumber)
      this.deleteQuestionIdFromDeleteRowCollections(rowDetails.objectionQuestionNumber)
    }
    return
  }
  deleteQuestionIdFromDeleteRowCollections(objectionQuestionNumber: any) {
    if (this.questionIds?.length > 0) {
      this.questionIds.map((val: any, index: any) => {
        if (val == objectionQuestionNumber) {
          this.questionIds.splice(index, 1);
        }
      })
    }
  }
  deleteUserAllocationArray(objectionQuestionNumber?: any) {
    if (objectionQuestionNumber) {
      this.userAllocation.userAllocation.map((val: any, index: any) => {
        if (val.objectionQuestionNumber == objectionQuestionNumber) {
          this.userAllocation.userAllocation.splice(index, 1);
        }
      })
    }
    else {
      this.userAllocation = [];
    }
  }
  applyFilterOne(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle(event: any) {
    if (event.checked) {
      let startIndex: any = (this.tableOnePaginator.pageIndex) * (this.tableOnePaginator.pageSize);
      let endIndex: any = (startIndex + this.tableOnePaginator.pageSize);
      this.userAllocation = [];

      this.dataSource.data.slice(startIndex, endIndex).map((val: any) => {
        this.selection.select(val)
        if (this.userAllocation.userAllocation) {
          this.userAllocation["userAllocation"].push(val)
        }
        else {
          this.userAllocation["userAllocation"] = [val]
        }
      })
    }
    else {
      this.selection.clear()
      this.userAllocation = [];
    }
    return;
  }
  removeAllocationDialog(buttonTextSubmit: string, buttonTextCancel: string,) {
    let returnResult: any;
    let isBoolean: any;
    if (this.selectedSubject) {
      if (this.userAllocation.userAllocation && this.userAllocation?.userAllocation.length != 0) {
        this.userAllocation.userAllocation.map((val: any) => {
          if (val.status == "YET_TO_ALLOCATE") {
            isBoolean = false
          }
          else if ((val.status == "ALLOCATED" && isBoolean) || (isBoolean == undefined)) {
            this.questionIds.push(val.objectionQuestionNumber)
            isBoolean = true
          }
        })
        if (isBoolean) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              paramDetails: this.questionIds,
              status: "REMOVED",
              title: 'Remove Allocation',
              message: 'Are you sure want to Remove Allocation?',
              buttonText: {
                cancel: buttonTextCancel,
                ok: buttonTextSubmit,
              },
            },
          })
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              returnResult = result;
              this.componentInteraction.setData('allocationSelectedSubject', this.selectedSubject)
              this.resetValue();
              setTimeout(() => {
                this.getAllocationDetails("event", true)
              }, 1000);
            }
          });
        }
        else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Remove Allocation',
              status: 'ALERT',
              message: 'Please select only Allocated status row(s)',
              buttonText: {
                cancel: 'No',
                ok: 'Ok',
              },
            },
          })

        }
      }
      else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'Remove Allocation',
            status: 'ALERT',
            message: 'Please select 1 or more question to remove',
            buttonText: {
              cancel: 'No',
              ok: 'Ok',
            },
          },
        })
      }
    }
    else {
      this.snackBar.openSnackBarFailure('Please Select Subject', 'close');
    }
  }
  addAllocationDialog(buttonTextSubmit: string, buttonTextCancel: string) {
    if (this.selectedSubject) {
      let returnResult: any;
      if (this.userAllocation.userAllocation && this.userAllocation?.userAllocation.length != 0) {
        const dialogRef = this.dialog.open(AddUserDialogComponent, {
          data: {
            title: 'Add Allocation',
            requestParam: this.userAllocation,
            subject: this.selectedSubject,
            message: 'Are you sure want to Save Allocation?',
            buttonText: {
              cancel: buttonTextCancel,
              ok: buttonTextSubmit,
            },
          },
        })
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            returnResult = result;
            this.componentInteraction.setData('allocationSelectedSubject', this.selectedSubject)
            this.resetValue();
            setTimeout(() => {
              this.getAllocationDetails("event", true)
            }, 500);
          }
        });
      }
      else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: {
            title: 'ADD Allocation',
            status: 'ALERT',
            message: 'Please select 1 or more question to Add/Modify',
            buttonText: {
              cancel: 'No',
              ok: 'Ok',
            },
          },
        })
      }
    }
    else {
      this.snackBar.openSnackBarFailure('Please Select Subject', 'close');
    }
  }
  getChildFormData(event?: any) {
    this.loader = true;
    this.resetValue();
    if (event) {
      this.selectedSubject = event.subject;
      this.selectedSMEId = event.smeId;
      this.selectedStatus = event.status;
      this.selectedExamName = event.examName;
      this.selectedDate = event.date;
      this.selectedBatch = event.batch;
      this.getAllocationDetails(event);
    }
  }
  getAllocationDetails(event: any, isReload?: any) {
    this.noRecordMessage = false;
    this.tableData = [];
    this.loader = true;
    let ELEMENT_DATA: any = []
    let requestParam: any = {}
    if (isReload) {
      requestParam.subject = this.selectedSubject ? this.selectedSubject : '';
      requestParam.status = this.selectedStatus ? this.selectedStatus : '';
      requestParam.smeId = this.selectedSMEId ? this.selectedSMEId : '';
      requestParam.examName = this.selectedExamName ? this.selectedExamName : '';
      requestParam.date = this.selectedDate ? this.selectedDate : '';
      requestParam.batch = this.selectedBatch ? this.selectedBatch : '';
      requestParam.userId = '';
    }
    else {
      requestParam.subject = event.subject
      requestParam.status = event.status
      requestParam.smeId = event.smeId
      requestParam.userId = event.userId
      requestParam.examName = event.examName
      requestParam.date = event.date
      requestParam.batch = event.batch
    }
    this.httpService.getAllocationDetails(requestParam).subscribe({
      next: (res: any) => {
        if (res.statuscode == "SUCC_000") {
          this.loader = false;
          let paginateLength = (this.paginateArray[this.paginateArray.length - 1] == res.allocationQuestion.length) ? true : false;
          if (!paginateLength) {
            this.paginateArray.push(res.allocationQuestion.length);
          }
          this.tableData = res.allocationQuestion;
          this.noRecordMessage = (this.tableData.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.allocationQuestion.map((val: any, index: number) => {
              let questionsDescription: any = '';
              let qstImage: any = '';
              if (val.objectionResponseContent.questions.length > 1) {
                val.objectionResponseContent.questions.map((questionsVal: any) => {
                  if (val.objectionResponseContent.subject != 'Language-I') {
                    if (questionsVal.language == "ENGLISH") {
                      questionsDescription = questionsVal.questionsDescription
                      qstImage = questionsVal.qstImage;
                    }
                    else {
                      questionsDescription = questionsDescription;
                      qstImage = qstImage;
                    }
                  }
                  else {
                    questionsDescription = val.objectionResponseContent.questions[1].questionsDescription;
                    qstImage = val.objectionResponseContent.questions[1].qstImage;
                  }
                })
              }
              else {
                questionsDescription = val.objectionResponseContent.questions[0].questionsDescription;
                qstImage = val.objectionResponseContent.questions[0].qstImage;
              }
              newObj = {
                ...newObj,
                sNo: index + 1,
                masterQP: val.objectionResponseContent.clientId, date: val.objectionResponseContent.examDate, batch: val.objectionResponseContent.examBatch, mdmName: val.objectionResponseContent.moduleName
                , questions: questionsDescription, questionImage: qstImage, name: val.allocationResponseContent.name, status: val.allocationResponseContent.status, smeId: val.allocationResponseContent.smeId, identifyNumber: val.allocationResponseContent.identifyNumber, objectionQuestionNumber: val.objectionResponseContent.objquesId
              }
              ELEMENT_DATA.push(newObj)
            })
            this.items = ELEMENT_DATA
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.tableOnePaginator;
            this.dataSource.sort = this.tableOneSort;
            this.currentPageSize = this.componentInteraction.getAttribute('currentPageSize') ? this.componentInteraction.getAttribute('currentPageSize') : this.paginateArray[0];
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      },
      error: (error: any) => {
        this.snackBar.openSnackBarFailure(error.error.error, 'close')
      }
    }),
      (error: any) => {
        this.snackBar.openSnackBarFailure(error.error.error, 'close')
      }
  }
  reloadCurrentPage() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  resetValue() {
    this.userSearchInputs = {};
    this.userAllocation = {};
    this.requestDataStoredArray = [];
    this.questionIds = []
    this.searchForm.reset()
    this.selection.clear()
  }
  getData(event: any) {
    this.componentInteraction.setData('currentPageSize', event.pageSize)
  }
}