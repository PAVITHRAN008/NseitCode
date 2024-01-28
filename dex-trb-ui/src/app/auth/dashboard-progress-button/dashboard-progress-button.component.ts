import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { NAVIGATION_URL_PATHS, USER_ROLES } from 'src/app/utils/constants';

@Component({
  selector: 'app-dashboard-progress-button',
  templateUrl: './dashboard-progress-button.component.html',
  styleUrls: ['./dashboard-progress-button.component.scss']
})
export class DashboardProgressButtonComponent implements OnInit {
  isSMERole = false;
  isAdminRole = false;
  yetToAllocate: any;
  allocatedQuestions: any;
  rejected: any;
  approved: any;
  pendingApproval: any;
  constructor(private httpService: HttpService, private router: Router, private componentInteraction: ComponentInteractionService) { }

  ngOnInit(): void {
    let role = this.componentInteraction.getAttribute('currentUserRole');
    (role == USER_ROLES.ADMIN) ? this.isAdminRole = true : this.isSMERole = true;
    let name = this.componentInteraction.getAttribute('name')
    if (role == "SME") {
      this.getSmeTitlesDetails(name)
    }
    else {
      this.getAllTitleDetails()
    }
  }
  getAllTitleDetails() {
    this.httpService.getTitleDetails().subscribe({
      next: (res) => {
        this.yetToAllocate = res.dashBoardTiles.pendingAllocation
        this.approved = res.dashBoardTiles.approved
        this.rejected = res.dashBoardTiles.rejected
        this.pendingApproval = res.dashBoardTiles.pendingApproval
      }
    })
  }
  getSmeTitlesDetails(name: any) {
    this.httpService.getIndividualSmeDetails(name).subscribe({
      next: (res) => {
        this.allocatedQuestions = res.dashBoardBySme[0].allocatedQuestions
        this.approved = res.dashBoardBySme[0].approved
        this.rejected = res.dashBoardBySme[0].rejected
        this.pendingApproval = res.dashBoardBySme[0].pendingApproval
      }
    })
  }
  navigateToAllocation(status: String) {
    this.componentInteraction.setData('dashboardActiveStatus', status)
    this.router.navigate(NAVIGATION_URL_PATHS.ALLOCATION_LIST);
  }
  navigateToApproval(status: String) {
    this.componentInteraction.setData('dashboardActiveStatus', status)
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_TRACKING_APPROVAL);
  }
}
