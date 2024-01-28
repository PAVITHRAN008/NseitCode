import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NAVIGATION_URL_PATHS, USER_ROLES } from 'src/app/utils/constants';

export interface tabledataone {
  sNo: string;
  masterQP: string;
  date: string;
  batch: string;
  mdmName: string;
  questions: string;
  status: string;
}
@Component({
  selector: 'app-objection-approval',
  templateUrl: './objection-approval.component.html',
  styleUrls: ['./objection-approval.component.scss']
})
export class ObjectionApprovalComponent implements OnInit {

  dataSource = new MatTableDataSource<tabledataone>();
  displayedColumnsOne: string[] = ['sNo', 'date', 'batch', 'mdmName', 'masterQP', 'questions', 'questionImage', 'smeName', 'status'];
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  private tableOnePaginator!: MatPaginator;
  private tableOneSort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.tableOneSort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.tableOnePaginator = mp;
    this.setDataSourceAttributes();
  }
  userSearchInputs: any = {};
  selectedSubject!: string;
  USER_ROLES: any = USER_ROLES;
  currentUserRole: any;
  responseTableData: any = [];
  loader: any = true;
  noRecordMessage: any = false;
  paginateArray: any = [3, 5, 10, 25, 100];
  currentPageSize: any;
  currentPageIndex: any;

  constructor(private snackBar: SnackbarService, private httpService: HttpService, private router: Router, private componentInteraction: ComponentInteractionService, private globalService: GlobalUseService) {
    this.dataSource = new MatTableDataSource;
  }

  ngOnInit(): void {
    this.loader = true;
    this.currentUserRole = this.componentInteraction.getAttribute('currentUserRole');
    this.selectedSubject = this.componentInteraction.getAttribute('userSelectedSubject')

  }
  applyFilterOne(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  importAsXlsx() {
    this.matTableExporter.exportTable('xlsx', { fileName: this.globalService.getFileName(this.selectedSubject).fileName, sheet: this.globalService.getFileName(this.selectedSubject).sheetName })
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource.sort = this.tableOneSort;
  }
  getChildFormData(event?: any) {
    this.loader = true;
    this.noRecordMessage = false;
    if (event) {
      this.responseTableData = [];
      this.selectedSubject = event.subject;
      let ELEMENT_DATA: any = [];
      this.httpService.getApprovalDetails(event).subscribe({
        next: (res: any) => {
          if (res.statuscode == "SUCC_000") {
            this.loader = false;
            this.responseTableData = res.allocationQuestion;
            let paginateLength = (this.paginateArray[this.paginateArray.length - 1] == res.allocationQuestion.length) ? true : false;
            if (!paginateLength) {
              this.paginateArray.push(res.allocationQuestion.length);
            }
            this.noRecordMessage = (this.responseTableData.length == 0) ? true : false;
            if (!this.noRecordMessage) {
              let newObj = {}
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
                  masterQP: val.objectionResponseContent.clientId, date: val.objectionResponseContent.examDate, batch: val.objectionResponseContent.examBatch, mdmName: val.objectionResponseContent.moduleName, questions: questionsDescription, questionImage: qstImage, name: val.allocationResponseContent.name, status: val.allocationResponseContent.status, userId: val.allocationResponseContent.userId, identifyNumber: val.allocationResponseContent.identifyNumber, objectionQuestionNumber: val.objectionResponseContent.objquesId
                }
                ELEMENT_DATA.push(newObj)
              })
            }
            this.dataSource.data = ELEMENT_DATA;
            this.dataSource.paginator = this.tableOnePaginator;
            this.dataSource.sort = this.tableOneSort;
            this.currentPageSize = this.componentInteraction.getAttribute('currentPageSize') ? this.componentInteraction.getAttribute('currentPageSize') : this.paginateArray[0];
            this.currentPageIndex = this.componentInteraction.getAttribute('currentPageIndex') ? this.componentInteraction.getAttribute('currentPageIndex') : 0;
          }
          else {
            this.noRecordMessage = true;
            this.loader = false
          }
        },
        error: (error: any) => {
          this.snackBar.openSnackBarFailure(error.error.error, 'close');
        }
      }),
        (error: any) => {
          this.snackBar.openSnackBarFailure(error.error.error, 'close');
        }
    }
  }

  viewObjectionDetails(rowDetails: any) {
    this.componentInteraction.setData('ObjectionApprovalRowDetails', rowDetails)
    this.componentInteraction.setData('ObjectionApprovalRowQuestionId', rowDetails.objectionQuestionNumber)
    this.navToObjectionTrackStatus();
  }
  navToObjectionTrackStatus() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_TRACKING_STATUS);
  }
  getData(event: any) {
    this.componentInteraction.setData('currentPageSize', event.pageSize);
    this.componentInteraction.setData('currentPageIndex', event.pageIndex)
  }
}