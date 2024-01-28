import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreAuthRoutingModule } from './pre-auth-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AppMaterialModule } from '../app.material-module';
import { LoginLeftPanelComponent } from './login-left-panel/login-left-panel.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginPageComponent,
    LoginFormComponent,
    LoginLayoutComponent,
    LoginLeftPanelComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    PreAuthRoutingModule,
  ]
})
export class PreAuthModule { }
