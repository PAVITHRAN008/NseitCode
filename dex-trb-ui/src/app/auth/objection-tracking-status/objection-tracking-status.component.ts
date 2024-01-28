import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { NAVIGATION_URL_PATHS, USER_ROLES } from 'src/app/utils/constants'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { HttpHeaders } from '@angular/common/http';
import { SnackbarService } from 'src/app/services/snackbar.service';
export interface questionDetails {
  questionBody: string;
  options: any[];
}

@Component({
  selector: 'app-objection-tracking-status',
  templateUrl: './objection-tracking-status.component.html',
  styleUrls: ['./objection-tracking-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectionTrackingStatusComponent implements OnInit {
  @ViewChild('fileUploadField') uploadFileField: any;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  approvalEntryForm!: FormGroup
  labelText: string = 'Select file';
  dataSource = new MatTableDataSource<questionDetails>();
  displayedColumnsOne: string[] = ['sNo', 'checkBox', 'questions', 'smeName', 'status'];
  @ViewChild('TableOnePaginator', { static: true })
  tableOnePaginator!: MatPaginator;
  @ViewChild('TableOneSort', { static: true })
  tableOneSort!: MatSort;
  selection = new SelectionModel<questionDetails>(true, []);
  userSearchInputs: any = {};
  selectedSubject!: string;
  questionsArray: any;
  multipleAnswerAction!: boolean;
  answerKeyAction!: boolean;
  objectionQuestionId: any
  viewObjectionDetails: any = {};
  viewFormDetails: any = {};
  currentUserRole!: any;
  USER_ROLES: any = USER_ROLES;
  objQuestion: any[] = [];
  standardList: any[] = []
  actionList: any[] = [];
  subjectList: any[] = [];
  fileName: any;
  rowDetails: any;
  activeRowDetails: any;
  isRejectBtnDisabled: any = true;
  isApproveBtnDisabled: any = true;
  modifyRequestParam: any = {};
  file: any = [];
  // lastUploadedFileName: any = "No files Chosen"
  multipleAnswerKey = "MULTIPLE_ANSWER_KEY";
  answerKeyChange = "ANSWER_KEY_CHANGE";
  saveDraftEnabled: boolean = false;
  isDraftTrue!: boolean;

  constructor(private router: Router, private snackBService: SnackbarService, private dialog: MatDialog, private formBuilder: FormBuilder, private httpService: HttpService, private componentInteraction: ComponentInteractionService) {

  }

  ngOnInit(): void {
    this.setValueOnPageLoad()
    this.objectionQuestionId = this.componentInteraction.getAttribute('ObjectionApprovalRowQuestionId')
    this.rowDetails = this.componentInteraction.getAttribute('ObjectionApprovalRowDetails');
    this.objQuestion.push(this.objectionQuestionId)
    this.getStandard()
    this.getAction();
    this.getSubject();
    this.dataSource = new MatTableDataSource;
    this.currentUserRole = this.componentInteraction.getAttribute('currentUserRole')
    this.activeRowDetails = this.componentInteraction.getAttribute('ObjectionApprovalRowDetails')
    this.getApprovedAllocationDetailByObjQuestion()
    this.dataSource.paginator = this.tableOnePaginator;
    this.dataSource.sort = this.tableOneSort;
  }
  setValueDisabledOnPageLoad(responseData?: any) {
    this.approvalEntryForm.patchValue({
      action: (responseData.action) ? responseData.action : '',
      subject: (responseData.subject) ? responseData.subject : '',
      standard: (responseData.remarks.standard) ? responseData.remarks.standard : '',
      pageNumber: (responseData.remarks.pageNumber) ? responseData.remarks.pageNumber : '',
      remarks: (responseData.remarks.remarks) ? responseData.remarks.remarks : '',
    });
    this.fileName = (responseData.remarks.docPath) ? responseData.remarks.docPath : ''
    if (this.activeRowDetails.status != 'PENDING_APPROVAL') {
      this.setDisableField()
    }
    if (!this.saveDraftEnabled) {
      this.btnDisabled(true);
    }
  }
  setValueOnPageLoad() {
    this.approvalEntryForm = this.formBuilder.group({
      action: ['', Validators.required],
      subject: ['', Validators.required],
      standard: ['', Validators.required],
      pageNumber: ['', Validators.required],
      remarks: ['', Validators.required],
    })
  }
  setDisableField() {
    this.approvalEntryForm.controls['action'].disable();
    this.approvalEntryForm.controls['subject'].disable();
    this.approvalEntryForm.controls['standard'].disable();
    this.approvalEntryForm.controls['pageNumber'].disable();
    this.approvalEntryForm.controls['remarks'].disable();
  }
  getStandard() {
    this.httpService.getStandardResponse().subscribe({
      next: (res: any) => {
        this.standardList = res;
      },
      error: (error: any) => {
      }
    })
  }
  getAction() {
    this.httpService.getActionResponse().subscribe({
      next: (res: any) => {
        this.actionList = res.code;
      },
      error: (error: any) => {
      }
    })
  }
  getSubject() {
    this.httpService.getSubjectResponse().subscribe({
      next: (res: any) => {
        this.subjectList = res.subjects
      }
    })
  }
  getApprovedAllocationDetailByObjQuestion() {
    this.httpService.getApprovedAllocationDetailByObjQuestion(this.objQuestion).subscribe((res: any) => {
      this.viewFormDetails = res.responseContent[0];
      this.file = [];
      let newObj: any = {};
      this.viewFormDetails.remarks.docPath.map((val: any, index: number) => {
        let string: any = val.split('.');
        newObj = { ...newObj, docPath: val, type: string[1], name: this.viewFormDetails.remarks.fileNames[index] };
        // this.lastUploadedFileName = newObj.name;
        this.file.push(newObj)
      })
      this.getObjectionDetails(res.responseContent[0]);
    },
      (error) => {
      })

  }
  getObjectionDetails(resFromViewFormDetails?: any) {
    this.httpService.getAdminObjectionViewResponse(this.objectionQuestionId).subscribe((res: any) => {
      this.viewObjectionDetails = res.responseContent;
      if (resFromViewFormDetails) {
        this.setValueDisabledOnPageLoad(resFromViewFormDetails);
      }

      this.viewObjectionDetails.questions.map((val: any, index: number) => {
        val.options.map((valOption: any) => {
          if (valOption.modAnsId) {
            if (this.viewFormDetails.action == this.multipleAnswerKey) {
              valOption.multipleAnswerKeyChecked = true;
              valOption.answerKeyChangeChecked = false;
            }
            else {
              valOption.answerKeyChangeChecked = true;
              valOption.multipleAnswerKeyChecked = false;
            }
          }
          else {
            valOption.multipleAnswerKeyChecked = false;
            valOption.answerKeyChangeChecked = false;
          }
        })
        val.sortId = index;
      })
      this.viewObjectionDetails.questions.sort((a: any, b: any) => {
        if (a.language == "ENGLISH") {
          a.sortId = -1
        }
        return a.sortId - b.sortId;
      })
      if (this.viewObjectionDetails.subject == 'Language-I') {
        let tempQuestionObject = res.responseContent.questions[1];
        tempQuestionObject.firstLanguage = true;
        this.viewObjectionDetails.questions = [];
        this.viewObjectionDetails.questions.push(tempQuestionObject)
      }
      if (this.viewObjectionDetails.subject == 'Language-II') {
        let tempQuestionObject = res.responseContent.questions[0];
        tempQuestionObject.firstLanguage = true;
        this.viewObjectionDetails.questions = [];
        this.viewObjectionDetails.questions.push(tempQuestionObject)
      }
      if (this.viewObjectionDetails.objquesId) {
        this.viewObjectionDetails.questions.map((question: any) => {
          question.options.map((val: any) => {
            if (val.modAnsId) {
              if (this.modifyRequestParam?.objquesId) {
                let newObj: any = {}
                newObj = { ...newObj, optionId: val.optionId, optionDescription: val.optionDescription }
                this.modifyRequestParam.options.push(newObj)
              }
              else {
                this.modifyRequestParam = {
                  ...this.modifyRequestParam,
                  objquesId: this.viewObjectionDetails.objquesId,
                  options: [{
                    optionId: val.optionId,
                    optionDescription: val.optionDescription
                  }]
                }
              }
            }
          })
        })
      }
      this.setSno(this.viewObjectionDetails);
    },
      (error) => {
      })
  }
  setSno(viewObjectionDetails: any) {
    viewObjectionDetails.candidateObjctions.map((val: any, index: number) => {
      val.sNo = index + 1;
    })
  }
  btnApproveDraft(btnName: string) {
    if (btnName == 'draft') {
      let action = this.approvalEntryForm.get('action')?.value;
      if (action != '') {
        this.btnDraft(true);
      }
      else {
        this.snackBService.openSnackBar("Please select Action!", 'close');
      }
    }
    else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          status: "APPROVED",
          title: 'APPROVED Objection',
          message: "No further modifications can be made, Are your sure you want to Approve? ",
          buttonText: {
            cancel: "Cancel",
            ok: "Approve",
          },
        },
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let requestParam = this.setParamValue();
          requestParam.append('status', "APPROVED")
          if (this.multipleAnswerAction || this.answerKeyAction) {
            if (this.modifyRequestParam.options.length != 0) {
              this.saveModifyAnswer(requestParam)
            }
            else {
              this.snackBService.openSnackBar("Please select the corresponding option(s)", 'close');
            }
          }
          else {
            this.deleteDetailByObjQuestion(requestParam);
          }
        }
      });
    }
  }
  btnDraft(btnName: any) {
    this.saveDraftEnabled = true;
    this.isDraftTrue = true;
    let requestParam = this.setParamValue();
    requestParam.append('status', '')
    if (this.multipleAnswerAction || this.answerKeyAction) {
      (this.modifyRequestParam.options.length != 0) ? this.saveModifyAnswer(requestParam) : this.snackBService.openSnackBar("Please select the corresponding option(s)", 'close');
    }
    else {
      this.deleteDetailByObjQuestion(requestParam);
    }
  }
  setParamValue() {
    let formData: any = new FormData()
    formData.append('userId', this.rowDetails.userId);
    formData.append('subject', this.approvalEntryForm.get('subject')?.value);
    formData.append('pageNumber', this.approvalEntryForm.get('pageNumber')?.value);
    formData.append('standard', this.approvalEntryForm.get('standard')?.value,);
    formData.append('remarks', this.approvalEntryForm.get('remarks')?.value);
    formData.append('action', this.approvalEntryForm.get('action')?.value);
    formData.append('objQuestion', this.rowDetails.objectionQuestionNumber);
    formData.append('identifyNumber', this.rowDetails.identifyNumber);
    if (this.file.length != 0) {
      this.file.map((val: any) => {
        formData.append('files', new Blob([val]), val.name)
      })
    }
    return formData
  }
  saveModifyAnswer(requestParam: any) {
    this.httpService.saveSMEModifyAnswer(this.modifyRequestParam).subscribe({
      next: (res: any) => {
        if (res.statusCode == "SUC-001") {
          this.approveOrRejectHttp(requestParam);
        }
        else {
          this.snackBService.openSnackBar(res.message, 'close');
        }
      },
      error: (error: any) => {
      }
    })
  }

  approveOrRejectHttp(requestParam: any) {
    this.httpService.approvedOrRejectResponse(requestParam).subscribe({
      next: (res: any) => {
        this.snackBService.openSnackBar(res.message, 'close');
        if (this.isDraftTrue) {
          setTimeout(() => {
            this.getApprovedAllocationDetailByObjQuestion();
          }, 1000);
        }
        else {
          this.navToObjectionTrackApproval();
        }
      },
      error: (error: any) => {
      }
    })
  }
  navToObjectionTrackApproval() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_TRACKING_APPROVAL);
  }
  btnReject(buttonTextSubmit: string, buttonTextCancel: string,) {
    let requestParam = this.setParamValue();
    requestParam.append('status', "REJECTED")
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        paramDetails: requestParam,
        status: "REJECTED",
        title: 'Reject Objection',
        message: "No further modifications can be made, Are your sure you want to Reject? ",
        buttonText: {
          cancel: buttonTextCancel,
          ok: buttonTextSubmit,
        },
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDetailByObjQuestion();
        this.navToObjectionTrackApproval();
      }
    });
  }

  applyFilterOne(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  getChildFormData(event: any) {
    this.selectedSubject = event.subject;
  }
  selectAction(event: any, isPageLoad?: any) {
    this.isApproveBtnDisabled = false;
    (isPageLoad) ? '' : this.resetValue();
    if (event.value == "MULTIPLE_ANSWER_KEY") {
      this.multipleAnswerAction = true;
      this.answerKeyAction = false;
      this.isRejectBtnDisabled = true
    }
    else if (event.value == "ANSWER_KEY_CHANGE") {
      this.answerKeyAction = true;
      this.multipleAnswerAction = false;
      this.isRejectBtnDisabled = true
    }
    else if (event.value == "NO_CHANGE") {
      this.multipleAnswerAction = false;
      this.answerKeyAction = false;
      this.isRejectBtnDisabled = false
      this.isApproveBtnDisabled = true
    }
    else {
      this.answerKeyAction = false;
      this.isRejectBtnDisabled = true
      this.multipleAnswerAction = false;
    }
  }
  resetValue() {
    this.modifyRequestParam = [];
  }
  modifyAnswer(event: any, objQuestionNo: any, optionId: any, optionDesc: any, isRadio: any) {
    if (event) {
      if (this.modifyRequestParam?.objquesId) {
        if (event.source?.checked && isRadio) {
          this.modifyRequestParam.options[0].optionId = optionId;
          this.modifyRequestParam.options[0].optionDescription = optionDesc;
        }
        else {
          let newObj: any = {}
          newObj = { ...newObj, optionId: optionId, optionDescription: optionDesc }
          this.modifyRequestParam.options.push(newObj)
        }
      }
      else {
        this.modifyRequestParam = {
          ...this.modifyRequestParam,
          objquesId: objQuestionNo,
          options: [{
            optionId: optionId,
            optionDescription: optionDesc
          }]
        }
      }
      return;
    }
    else {
      this.modifyRequestParam.options.map((val: any, index: any) => {
        if (val.optionId == optionId) {
          this.modifyRequestParam.options.splice(index, 1);
        }
      })
    }
    return;
  }
  fileUpload(event: any) {
    if (event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'application/pdf' || event.target.files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || event.target.files[0].type == 'application/msword' || event.target.files[0].type == 'image/png') {
      for (var i = 0; i < event.target.files.length; i++) {
        // this.lastUploadedFileName = event.target.files[i].name;
        this.file.push(event.target.files[i]);
      }
    }
    else {
      this.snackBService.openSnackBar("Please upload valid format file", 'close');
    }
  }
  fileDownload(path: any) {
    this.httpService.getFileDownloadResponse(path).subscribe({
      next: (res: any) => {
        const data = res.body;
        const blob = new Blob([data], { type: 'application/zip' });
        this.save(blob, this.getFileName(res.headers, path));
      },
      error: (error: any) => {
      }
    })

  }
  private getFileName(headers: HttpHeaders, UploadedFileName: string) {
    const contentDisposition = headers.get('Content-Disposition') || '';
    let matches: any = /filename=([^;]+)/ig.exec(contentDisposition);
    matches = (matches != null) ? matches[1] : UploadedFileName;
    const fileName: any = (matches || 'file.zip').trim();
    return fileName;
  }
  save(data: Blob, name: string) {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.setAttribute('target', '_blank');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  removeFile(fileName: any, filePath: any, objQuestionId: any) {
    this.file.map((val: any, index: any) => {
      if (val.name == fileName) {
        this.file.splice(index, 1);
      }
      // else {
      //   this.lastUploadedFileName = val.name;
      // }
    })
    this.deleteFileFromFTP(filePath, objQuestionId);
    //this.lastUploadedFileName = (this.file.length == 0) ? "No files Chosen" : this.lastUploadedFileName;
    (this.file.length == 0) ? this.uploadFileField.nativeElement.value = '' : this.uploadFileField.nativeElement.value
  }
  btnDisabled(isPageLoad?: any) {
    let newObj: any = {};
    newObj = { ...newObj, value: this.approvalEntryForm.get('action')?.value }
    this.selectAction(newObj, isPageLoad);
  }
  deleteFileFromFTP(path: any, objQuestionId: any) {
    let requestParam = {
      files: path,
      objQuestion: objQuestionId,
      userId: this.viewFormDetails.userId
    }
    this.httpService.deleteFileResponse(requestParam).subscribe((res: any) => {
      (error: any) => { }
    })
  }
  deleteDetailByObjQuestion(requestParam?: any) {
    this.httpService.deleteDetailByObjQuestionResponse(this.viewObjectionDetails.objquesId).subscribe((res: any) => {
      if (requestParam) {
        this.approveOrRejectHttp(requestParam);
      }
      (error: any) => {
      }
    })
  }
  deleteByObjQuestion() {
    this.httpService.deleteDetailByObjQuestionResponse(this.objQuestion).subscribe((res: any) => {
      (error: any) => {
      }
    })
  }

}