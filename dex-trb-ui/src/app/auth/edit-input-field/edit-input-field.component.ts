import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

export class updateData {
  expiryDate!: string;
  identityNumber!: string;
  name!: string;
  role!: string;
  subject!: string;
}

@Component({
  selector: 'app-edit-input-field',
  templateUrl: './edit-input-field.component.html',
  styleUrls: ['./edit-input-field.component.scss']
})
export class EditInputFieldComponent implements OnInit {
  subjectsCollection!: any;
  userInputForm!: FormGroup;
  fieldDisabled!: String;
  today = new Date()
  constructor(@Inject(MAT_DIALOG_DATA) public editData: any, private httpService: HttpService, private formBuilder: FormBuilder, private dailogref: MatDialogRef<EditInputFieldComponent>, private snackBService: SnackbarService) {
  }

  ngOnInit(): void {
    this.userInputForm = this.formBuilder.group({
      subject: ['', Validators.required],
      name: ['', Validators.required],
      identityNumber: ['', Validators.required,],
      expiryDate: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    if (this.editData) {
      this.getSubject();
    }
    this.fieldDisabled = 'yes'
  }
  setValue(editDatas: any) {
    this.userInputForm.controls['subject'].setValue(editDatas.subject);
    this.userInputForm.controls['name'].setValue(editDatas.firstName);
    this.userInputForm.controls['identityNumber'].setValue(editDatas.identityNumber);
    this.userInputForm.controls['expiryDate'].setValue(editDatas.expiryDate);
    this.userInputForm.controls['userName'].setValue(editDatas.userId);
    this.userInputForm.controls['password'].setValue(editDatas.password);
  }
  getSubject() {
    this.httpService.getSubjectResponse().subscribe((responseData: any) => {
      this.subjectsCollection = responseData.subjects
      this.userInputForm.patchValue({
        subject: this.subjectsCollection[0]
      });
      this.setValue(this.editData);
    },
      (error: any) => { })
  }
  updateUser() {
    let expiryDate = new Date(this.userInputForm.value.expiryDate)
    this.userInputForm.value.expiryDate = expiryDate?.toLocaleDateString('sv');
    let requestparam = {
      userDetails: [{
        expiryDate: this.userInputForm.value.expiryDate, 
        identityNumber: this.userInputForm.value.identityNumber,
        name: this.userInputForm.value.name,
        role: "SME",
        subject: this.userInputForm.value.subject
      }
      ]
    }
    this.httpService.updateUser(requestparam).subscribe({
      next: (response) => {
        this.snackBService.openSnackBar(response.message, 'close')
        this.userInputForm.reset();
        this.dailogref.close(true)
      },
      error: () => {
        this.snackBService.openSnackBar('Error while Updated', 'close')
      }
    })


  }
}
