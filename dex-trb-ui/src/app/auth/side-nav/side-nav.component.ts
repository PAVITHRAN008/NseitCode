import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { NAVIGATION_URL_PATHS, USER_ROLES } from 'src/app/utils/constants';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  isSMERole = false;
  isAdminRole = false;
  USER_ROLES: any = USER_ROLES
  panelOpenState = false;
  constructor(private router: Router,private dialog: MatDialog, private componentInteraction: ComponentInteractionService) { }

  ngOnInit(): void {
    let role = this.componentInteraction.getAttribute('currentUserRole');
    (role == USER_ROLES.ADMIN) ? this.isAdminRole = true : this.isSMERole = true;
  }
  navigateToDashBoard() {
    this.router.navigate(NAVIGATION_URL_PATHS.DASHBOARD);
  }
  navigateToAdminManagement() {
    this.router.navigate(NAVIGATION_URL_PATHS.ADMIN_MANAGEMENT);
  }
  navigateToAllocation() {
    this.router.navigate(NAVIGATION_URL_PATHS.ALLOCATION_LIST);
  }
  navigateToApproval() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_TRACKING_APPROVAL);
  }
  navigateToLogin() {
    this.router.navigate(NAVIGATION_URL_PATHS.LOGIN);
  }
  navigateToSmeReport() {
    this.router.navigate(NAVIGATION_URL_PATHS.SME_REPORT)
  }
  navigateToObjectionSummaryReport() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_SUMMARY_REPORT)
  }
  navigateToFinalSummaryReport() {
    this.router.navigate(NAVIGATION_URL_PATHS.FINAL_SUMMARY_REPORT)
  }
  navigateToFinalObjectionDetailedReport() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_DETAILED_REPORT)
  }
  navigateToChangePassword(){
      let dailogref = this.dialog.open(ChangePasswordComponent, {
        width: "40%",
      })
  }
}
