import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { USER_ROLES } from 'src/app/utils/constants';
@Component({
  selector: 'app-user-input-field',
  templateUrl: './user-input-field.component.html',
  styleUrls: ['./user-input-field.component.scss']
})
export class UserInputFieldComponent implements OnInit, AfterViewInit {

  @Input('titleHeader') titleHeader: String = '';
  @Output() sendDataToChild = new EventEmitter<any>();
  userInputForm: any = FormGroup;
  USER_ROLES: any = USER_ROLES;
  subjectsCollection!: any;
  statusCollection!: any;
  sessionCollection!: any;
  currentPath: any;
  selectedSubject: any;
  dateCollection: any = [];
  batchCollection:any = [];
  examCollection: any = [];
  dateSessionCollection!: any;
  batch: any = [];
  exam:any = [];
  isSubjectDisabled: any = true;
  currentUserRole: any;
  userDetails: any;
  isDashboardActiveStatus: any;
  constructor(private router: Router, private formBuilder: FormBuilder, private httpService: HttpService, private componentInteraction: ComponentInteractionService) {
  }
  ngOnInit(): void {
    this.isDashboardActiveStatus = this.componentInteraction.getAttribute('dashboardActiveStatus');
    let role = this.componentInteraction.getAttribute('currentUserRole');
    this.currentUserRole = role;
    (this.currentUserRole != USER_ROLES.SME) ? this.getSubject() : this.setSubjectForSME();

    if (this.router.url == '/auth/objection-approval') {
      this.getStatusForApproval()
      this.getSession()
    }
    else {
      this.isSubjectDisabled = true
      this.getStatus();
      this.getSession();
    }
  }
  ngAfterViewInit(): void {
  }
  setValueOnPageLoad() {

    this.userInputForm = this.formBuilder.group({
      subject: [''],
      smeId: [''],
      status: [''],
      date: '',
      batch: [''],
      examName: '',
      subjectSME: ['']
    });
  }
  setSubjectForSME() {
    this.setValueOnPageLoad();
    let activeStatus = this.componentInteraction.getAttribute('dashboardActiveStatus')
    this.userDetails = this.componentInteraction.getAttribute('userDetails');
    this.userInputForm.patchValue({
      subjectSME: this.userDetails.subject,
      status: activeStatus
    });
    this.selectedSubject = this.userInputForm.get('subjectSME').value;
    this.userInputForm.get('subjectSME').disable();
    this.componentInteraction.setData('allocationSelectedSubject', this.selectedSubject)
    this.getSearchInput()
  } 
  getSubject() {
    this.setValueOnPageLoad();
    let activeStatus = this.componentInteraction.getAttribute('dashboardActiveStatus')
    this.httpService.getSubjectResponse().subscribe((responseData: any) => {
      this.subjectsCollection = responseData.subjects
      if (activeStatus) {
        this.userInputForm.patchValue({
          status: activeStatus
        });
        this.componentInteraction.setData('dashboardActiveStatus', false);
      }
      else {
        let storedSubject = this.componentInteraction.getAttribute('userSelectedSubject')
        if (storedSubject) {
          this.userInputForm.patchValue({
            subject: storedSubject,
          });
        }
        else {
          this.userInputForm.patchValue({
            subject: this.subjectsCollection[0],
          });
        }
      }
      this.selectedSubject = this.userInputForm.get('subject').value;
      this.componentInteraction.setData('allocationSelectedSubject', this.selectedSubject)
      this.getSearchInput()
    },
      (error: any) => { })
  }
  getStatus() {
    this.httpService.getStatusResponse().subscribe((responseData: any) => {
      this.statusCollection = responseData.code
    })
  }
  getStatusForApproval() {
    this.httpService.getStatusResponseForApproval().subscribe((responseData: any) => {
      this.statusCollection = responseData.code
      this.isSubjectDisabled = false
    })
  }
  getSearchInput() {

    let formValue: any = {
      status: this.userInputForm.get('status')?.value,
      smeId: this.userInputForm.get('smeId')?.value,
      examName: this.userInputForm.get('examName')?.value,
      date: this.userInputForm.get('date')?.value,
      batch: this.userInputForm.get('batch')?.value,
    };
    (this.currentUserRole == USER_ROLES.SME) ? formValue.subject = this.userInputForm.get('subjectSME')?.value : formValue.subject = this.userInputForm.get('subject')?.value;
    (this.currentUserRole == USER_ROLES.SME) ? formValue.userId = this.userDetails.userId : formValue.userId = '';
    this.componentInteraction.setData('userSelectedSubject', formValue.subject)
    this.sendDataToChild.emit(formValue);
    if (formValue.subject == '' && formValue.smeId == '' && formValue.status == '' && this.router.url != '/auth/objection-approval') {
      this.sendDataToChild.emit('refresh')
    }
  }
  clearSearch() {
    let isAllocationUrl = (this.router.url == '/auth/allocation-list' || this.currentUserRole == USER_ROLES.SME) ? true : false
    if (isAllocationUrl) {
      this.resetForm(isAllocationUrl);
      this.getSearchInput();
      this.dateCollection = [];
      this.batchCollection = []
    }
    else if (this.currentUserRole == USER_ROLES.ADMIN && this.router.url == '/auth/objection-approval') {
      this.resetForm(true);
      this.getSearchInput();
      this.dateCollection = [];
      this.batchCollection = []
    }
    else {
      this.resetForm(isAllocationUrl);
      this.sendDataToChild.emit('refresh')
    }
  }
  resetForm(isSubjectDisable: any) {
    if (isSubjectDisable) {
      this.userInputForm.get('smeId')?.setValue('')
      this.userInputForm.get('status')?.setValue('')
      this.userInputForm.get('examName')?.setValue('')
      this.userInputForm.get('date')?.setValue('')
      this.userInputForm.get('batch')?.setValue('')
    }
    else {
      this.userInputForm.get('subject')?.setValue('')
      this.userInputForm.get('smeId')?.setValue('')
      this.userInputForm.get('status')?.setValue('')
      this.userInputForm.get('examName')?.setValue('')
      this.userInputForm.get('date')?.setValue('')
      this.userInputForm.get('batch')?.setValue('')
    }

  }
  getSession(){
    this.httpService.getSessionResponse().subscribe((responseData:any)=>{
      this.dateSessionCollection = responseData.examDetails;
      this.dateSessionCollection.map((val:any)=>{
        this.exam.push(val.examName)
      })
      this.examCollection = [...new Set(this.exam)]
    })
  }
  changeDate(exam:any){
    this.dateCollection = [];
    this.dateSessionCollection.map((val:any)=>{
      if(val.examName == exam.value){
        this.dateCollection.push(val.date)
      }
    })
  }
  changeBatch(date:any){
    this.batchCollection = []
    this.dateSessionCollection.map((val:any)=>{
      if(val.date == date.value && val.examName == this.userInputForm.get('examName').value ){
        val.batch.map((batch:any)=>{
          this.batchCollection.push(batch)
        })
      }
    })
  }
}