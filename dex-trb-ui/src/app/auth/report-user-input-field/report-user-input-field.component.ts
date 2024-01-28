import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-report-user-input-field',
  templateUrl: './report-user-input-field.component.html',
  styleUrls: ['./report-user-input-field.component.scss']
})
export class ReportUserInputFieldComponent implements OnInit {
  @Input('titleHeader') titleHeader: String = '';
  @Output() sendDataToChild = new EventEmitter<any>();
  userInputForm: any = FormGroup;
  subjectsCollection!: any;
  sessionCollection!: any;
  dateCollection: any = [] ;
  batchCollection: any =[];
  examCollection:any = [] ;
  exam:any = [] ;
  dateSessionCollection!:any;
  selectedSubject: any;
  
  constructor(private formBuilder: FormBuilder, private componentInteraction: ComponentInteractionService, private httpService: HttpService,) { }

  ngOnInit(): void {
    this.getSession();
    this.getSubject();
  }
  setValueOnPageLoad() {
    this.userInputForm = this.formBuilder.group({
      subject: [''],
      smeName: [''],
      examName: '',
      date: '',
      batch: [''],
      masterQP: [''],
    });
  }
  getSearchInput() {
    let formValue: any = {
      subject: this.userInputForm.get('subject')?.value,
      smeName: this.userInputForm.get('smeName')?.value,
      examName: this.userInputForm.get('examName')?.value,
      date: this.userInputForm.get('date')?.value,
      batch: this.userInputForm.get('batch')?.value,
      masterQP: this.userInputForm.get('masterQP')?.value,
    };
    this.sendDataToChild.emit(formValue);
  }
  clearSearch(){
    this.dateCollection = [];
    this.batchCollection = []
    this.resetForm()
    this.getSearchInput()
  }
  resetForm(){
      this.userInputForm.get('subject')?.setValue('')
      this.userInputForm.get('smeName')?.setValue('')
      this.userInputForm.get('examName')?.setValue('')
      this.userInputForm.get('date')?.setValue('')
      this.userInputForm.get('batch')?.setValue('')
      this.userInputForm.get('masterQP')?.setValue('')
  }
  getSubject() {
    this.setValueOnPageLoad();
    let activeStatus = this.componentInteraction.getAttribute('dashboardActiveStatus')
    this.httpService.getSubjectResponse().subscribe((responseData: any) => {
      this.subjectsCollection = responseData.subjects
      this.selectedSubject = this.userInputForm.get('subject').value;
      this.getSearchInput()
    },
      (error: any) => {})
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
 