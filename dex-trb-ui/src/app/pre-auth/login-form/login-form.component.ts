import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EMPTY, NAVIGATION_URL_PATHS } from 'src/app/utils/constants';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  userInputForm!: FormGroup;
  username!: String;
  password!: String;
  role: any;
  loginUsername: string = EMPTY.STRING;
  loginPassword: string = EMPTY.STRING;
  usernameErrorMessage: string = EMPTY.STRING;
  passwordErrorMessage: string = EMPTY.STRING;
  authenticationErrorMessage: string = EMPTY.STRING;
  hide = true;
  constructor(private router: Router, private componentInteraction: ComponentInteractionService, private snackBService: SnackbarService, private httpService: HttpService, private formBuilder: FormBuilder) {
    this.userInputForm = this.formBuilder.group({
      userName: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
  }
  login() {
    this.navigateToDashboard()
    // let loginUsername = this.userInputForm.value.userName;
    // let loginPassword = this.userInputForm.value.password;
    // this.usernameErrorMessage = loginUsername ? EMPTY.STRING : 'Please enter the username';
    // this.passwordErrorMessage = loginPassword ? EMPTY.STRING : 'Please enter the password';
    // if (loginUsername && loginPassword) {
    //   this.initiateUserAuthentication(loginUsername, loginPassword);
    // }
  }
  initiateUserAuthentication(loginUsername: string, loginPassword: string) {
    this.username = loginUsername;
    this.password = loginPassword
    this.componentInteraction.setData('username', loginUsername)
    this.componentInteraction.setData('password', loginPassword)
    this.httpService.loginUserAuthentication().subscribe({
      next: (res: any) => {
        if (res.responseContent.status == 'SUCC-000') {
          let role = res.responseContent.role[0].authority
          let name = res.responseContent.name
          let valdityInDays = res.responseContent.userDetails[0].valdityInDays
          this.componentInteraction.setData('currentUserRole', role)
          this.componentInteraction.setData('name', name)
          this.componentInteraction.setData('userDetails', res.responseContent.userDetails[0]);
          this.navigateToDashboard()

          if (role == "SME" && valdityInDays < 6) {
            this.snackBService.validitySnackBar('Your validity expires in' + ' ' + [valdityInDays] + ' ' + 'days', 'close')
          }
        }
        else {
          this.passwordErrorMessage = 'User validity expired'
        }
      },
      error: (error: any) => {
        let status = error.status;
        if (status == 401) {
          this.passwordErrorMessage = 'Please enter valid credentials';
        }
      }
    });
  }
  navigateToDashboard() {
    this.router.navigate(NAVIGATION_URL_PATHS.DASHBOARD);
  }

}
