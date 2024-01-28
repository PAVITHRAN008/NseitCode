import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RootComponent } from './root/root.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { AppMaterialModule } from "../app.material-module";
import { UserInputFieldComponent } from './user-input-field/user-input-field.component';
import { AllocationListComponent } from './allocation-list-component/allocation-list/allocation-list.component';
import { TitleHeaderComponent } from './title-header/title-header.component';
import { TableTitleHeaderComponent } from './table-title-header/table-title-header.component';
import { EditInputFieldComponent } from './edit-input-field/edit-input-field.component';
import { AddUserFieldComponent } from './add-user-field/add-user-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { ObjectionTrackingComponent } from './objection-tracking/objection-tracking.component';
import { ObjectionTrackingStatusComponent } from './objection-tracking-status/objection-tracking-status.component';
import { ObjectionApprovalComponent } from './objection-approval/objection-approval.component';
import { ObjectionTableCandidateComponent } from './objection-table-candidate/objection-table-candidate.component';
import { DashboardProgressButtonComponent } from './dashboard-progress-button/dashboard-progress-button.component';
import { SmeReportComponent } from './sme-report/sme-report.component';
import { ObjectionSummaryReportComponent } from './objection-summary-report/objection-summary-report.component';
import { FinalSummaryReportComponent } from './final-summary-report/final-summary-report.component';
import { ReportUserInputFieldComponent } from './report-user-input-field/report-user-input-field.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ObjectionDetailedReportComponent } from './objection-detailed-report/objection-detailed-report.component';
import { AddUserErrorDailogComponent } from './add-user-error-dailog/add-user-error-dailog.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    RootComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    AdminManagementComponent,
    AllocationListComponent,
    UserInputFieldComponent,
    EditInputFieldComponent,
    AddUserFieldComponent,
    TitleHeaderComponent,
    TableTitleHeaderComponent,
    ConfirmationDialogComponent,
    AddUserDialogComponent,
    ObjectionTrackingComponent,
    ObjectionTrackingStatusComponent,
    ObjectionApprovalComponent,
    ObjectionTableCandidateComponent,
    DashboardProgressButtonComponent,
    SmeReportComponent,
    ObjectionSummaryReportComponent,
    FinalSummaryReportComponent,
    ReportUserInputFieldComponent,
    ObjectionDetailedReportComponent,
    AddUserErrorDailogComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule.forRoot()
  ],
  providers: []
})
export class AuthModule { }
