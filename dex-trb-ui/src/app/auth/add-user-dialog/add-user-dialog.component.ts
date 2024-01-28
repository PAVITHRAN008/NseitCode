import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { startWith } from 'rxjs/operators'
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NAVIGATION_URL_PATHS } from 'src/app/utils/constants';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {
  addAllocationForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  title: String = ''
  message: string = '';
  confirmButtonText: String = ''
  cancelButtonText: String = ''
  smeName: any = [];
  myControl = new FormControl('');
  filteredOptions: Observable<any[]> | undefined;
  subject!: string
  requestParam: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private router: Router, private SnackbarService: SnackbarService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>, private formBuilder: FormBuilder, private httpService: HttpService, private snackBar: MatSnackBar) {

    if (data) {
      this.title = data.title;
      this.requestParam = data.requestParam
      this.subject = data.subject;
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
    this.addAllocationForm = this.formBuilder.group({
      subject: new FormControl({ value: this.subject, disabled: true }),
    });
  }
  ngOnInit(): void {
    this.getSMEBySubject(this.subject);
  }
  getSMEBySubject(subject: any) {
    this.httpService.getSmeNameBySubject(subject).subscribe((response: any) => {
      response.responseContent.map((val: any) => {
        this.smeName.push(val.userId);
      })
      this.filteredOptions = this.smeName
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value: any) => {
          const name = typeof value === 'string' ? value : value;
          return name ? this._filter(name as string) : this.smeName.slice();
        }),
      );
    },
      (error: any) => {
      })
  }
  onConfirmClick(): void {
    this.requestParam = { ...this.requestParam }
    this.requestParam.userAllocation.map((val: any) => {
      val.userId = this.myControl.value;
      val.subject = this.addAllocationForm.get('subject')?.value
      val.status = "ALLOCATED"
      val.objQuestion = val.objectionQuestionNumber
    })
    this.httpService.saveAllocation(this.requestParam).subscribe((response: any) => {
      this.SnackbarService.openSnackBar(response.message, 'close');
    },
      (error: any) => {
      })
    this.dialogRef.close(true);
  }
  navAllocation() {
    this.router.navigate(NAVIGATION_URL_PATHS.ALLOCATION_LIST)
  }
  displayFn(user: any): string {
    return user ? user : '';
  }
  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.smeName.filter((option: any) => option.toLowerCase().includes(filterValue));
  }
  openSnackBar(message: any) {
    this.snackBar.open(message, 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000
    });
  }
}
