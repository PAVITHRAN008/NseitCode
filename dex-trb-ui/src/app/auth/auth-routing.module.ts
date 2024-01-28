import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';
import { AddUserFieldComponent } from './add-user-field/add-user-field.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { AllocationListComponent } from './allocation-list-component/allocation-list/allocation-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditInputFieldComponent } from './edit-input-field/edit-input-field.component';
import { FinalSummaryReportComponent } from './final-summary-report/final-summary-report.component';
import { ObjectionApprovalComponent } from './objection-approval/objection-approval.component';
import { ObjectionDetailedReportComponent } from './objection-detailed-report/objection-detailed-report.component';
import { ObjectionSummaryReportComponent } from './objection-summary-report/objection-summary-report.component';
import { ObjectionTrackingStatusComponent } from './objection-tracking-status/objection-tracking-status.component';
import { ObjectionTrackingComponent } from './objection-tracking/objection-tracking.component';
import { RootComponent } from './root/root.component';
import { SmeReportComponent } from './sme-report/sme-report.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'admin-management', component: AdminManagementComponent },
      { path: 'allocation-list', component: AllocationListComponent },
      { path: 'edit', component: EditInputFieldComponent },
      { path: 'add-user', component: AddUserFieldComponent },
      { path: 'objection-tracking', component: ObjectionTrackingComponent },
      { path: 'objection-tracking-status', component: ObjectionTrackingStatusComponent },
      { path: 'objection-approval', component: ObjectionApprovalComponent },
      { path: 'sme-report', component: SmeReportComponent },
      { path: 'objection-summary-report', component: ObjectionSummaryReportComponent },
      { path: 'final-summary-report', component: FinalSummaryReportComponent },
      { path: 'objection-detailed-report', component: ObjectionDetailedReportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }