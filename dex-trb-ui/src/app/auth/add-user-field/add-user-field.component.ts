import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EMPTY, NAVIGATION_URL_PATHS } from 'src/app/utils/constants';
import { AddUserErrorDailogComponent } from '../add-user-error-dailog/add-user-error-dailog.component';
@Component({
  selector: 'app-add-user-field',
  templateUrl: './add-user-field.component.html',
  styleUrls: ['./add-user-field.component.scss']
})
export class AddUserFieldComponent {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  userForm: FormGroup;
  file: any;
  inputReadonly = true;
  addUserErrorMessage: string = EMPTY.STRING;
  today = new Date()
  subjectsCollection: any
  constructor(private formBuilder: FormBuilder, private componentInteraction: ComponentInteractionService, private router: Router, private dialog: MatDialog, private http: HttpService, private snackBService: SnackbarService) {
    this.userForm = this.formBuilder.group({
      userDetails: this.formBuilder.array([this.addUserFormGroup()])
    });
  }
  public toggleInputReadonly() {
    this.inputReadonly = !this.inputReadonly;
  }
  addUserFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ["",Validators.required],
      identityNumber: ["",Validators.required],
      subject: ["",Validators.required],
      expiryDate: ["",Validators.required]
    });
  }
  userFields(): FormArray {
    return this.userForm.get("userDetails") as FormArray
  }
  addUser() {
    this.userFields().push(this.addUserFormGroup());
  }
  removeUser(i: number) {
    this.userFields().removeAt(i);
  }
  setRole(userDetails: any) {
    userDetails.map((val: any) => {
      let role = "SME";
      val.role = role;
    })
  }
  setExpiryDate(userDetails: any) {
    userDetails.map((val: any) => {
      let expiryDate = new Date(val.expiryDate)
      val.expiryDate = expiryDate?.toLocaleDateString('sv');
    })
  }
  sendData() {
    let requestParam = this.userForm.value;
    this.setRole(requestParam.userDetails);
    this.setExpiryDate(requestParam.userDetails);
    if (this.userForm.valid) {
      this.http.addUserDetails(requestParam).subscribe({
        next: (response) => {
          if (response.statusCode == "SUC-001") {
            const dialogRef = this.dialog.open(AddUserErrorDailogComponent, {
              data: {
                paramDetails: response,
              },
            })
          }
          else {
            this.snackBService.openSnackBar(response.message, 'close')
          }
          this.userForm.reset();
          this.userFields().removeAt(1);
          this.addUserErrorMessage='';
        },
        error: (response) => {
          this.snackBService.openSnackBarFailure(response.message, 'close')
        }
      })
    }
    else{
      this.addUserErrorMessage = '*Please fill out all required fields'
    }
  }
  selectFile(event: any) {
    this.file = event.target.files[0];
  }
  ngOnInit(): void {
    this.getSubject();
  }
  getSubject() {
    this.http.getSubjectResponse().subscribe((responseData: any) => {
      this.subjectsCollection = responseData.subjects
      this.userForm.patchValue({
        subject: this.subjectsCollection[0]
      });
    },
      (error: any) => { })
  }
  uploadFile(file: any) {
    let userId = this.componentInteraction.getAttribute('name')
    let formData = new FormData()
    formData.append('file', new Blob([file], { type: 'text/csv' }), file.name);
    formData.append('userId', userId)
    this.http.bulkUploadUsers(formData).subscribe({
      next: (response) => {
        if (response.statusCode == "SUC-001") {
          const dialogRef = this.dialog.open(AddUserErrorDailogComponent, {
            data: {
              paramDetails: response,
            },
          })
        }
      }
    })
  }
  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  navigateToAdminManagement() {
    this.router.navigate(NAVIGATION_URL_PATHS.ADMIN_MANAGEMENT);
  }
  downloadFile() {
    let link = document.createElement("a");
    link.download = "BulkUpload";
    link.href = "assets/files/Bulk_Users_valid.csv";
    link.click();
  }
}
