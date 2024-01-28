import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EMPTY, BOOLEAN, NAVIGATION_URL_PATHS } from 'src/app/utils/constants';
import { FORM_LABELS } from '../auth.laabels';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  readonly LABEL: any = FORM_LABELS
  newPasswordForm: FormGroup
  confirmNewPasswordForm: FormGroup
  confirmNewPassword: any;
  newPassword: any;
  changePasswordHeader: any;
  userRole: any;
  userId: any;
  passwordMatchValidation: boolean = BOOLEAN.FALSE;
  emptyPasswordValidation: boolean = BOOLEAN.FALSE;
  passwordErrorMessage: string = EMPTY.STRING;
  constructor(private componentInteraction: ComponentInteractionService, private dailogref: MatDialogRef<ChangePasswordComponent>, private snackBService: SnackbarService, private router: Router, private http: HttpService) {

    this.newPasswordForm = new FormGroup({
      newPassword: new FormControl('', Validators.compose([Validators.required]))
    });
    this.confirmNewPasswordForm = new FormGroup({
      confirmNewPassword: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit(): void {

  }
  get pass() {
    return this.newPasswordForm.controls;
  }
  validatePassword(event: any) {
    this.passwordErrorMessage = '';
    this.passwordMatchValidation = event.target.value ? (this.newPassword != this.confirmNewPassword) : BOOLEAN.FALSE
  }
  changePassword() {
    let password = this.confirmNewPassword
    this.passwordErrorMessage = password ? EMPTY.STRING : 'Please enter the password';
    if (password) {
      this.updatePassword()
    }
  }
  updatePassword() {
    let name = this.componentInteraction.getAttribute('name');
    let requestData: any = {};
    requestData.password = this.confirmNewPassword;
    requestData.userId = name;
    this.http.setChangePassword(requestData).subscribe({
      next: (res) => {
        if (res.statusCode == 'SUC-009') {
          this.snackBService.openSnackBar('Password changed successfully. Please re-login again.',  'close')
          this.dailogref.close()
        }
        this.navigateToLogin()
      }
    });
  }
  navigateToLogin() {
    this.router.navigate(NAVIGATION_URL_PATHS.LOGIN);
  }
}
