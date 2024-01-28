import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';
import { SnackbarService } from 'src/app/services/snackbar.service'
import { NAVIGATION_URL_PATHS } from 'src/app/utils/constants';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  title: String = ''
  message: String = '';
  confirmButtonText: String = ''
  cancelButtonText: String = ''
  requestParam: any;
  status: any;
action:any
  constructor(private router: Router, @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>, private httpService: HttpService, private snackBService: SnackbarService, private componentInteraction: ComponentInteractionService,) {
    if (data) {
      this.requestParam = data.paramDetails,
        this.status = data.status
      this.title = data.title
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }
  ngOnInit(): void {
  }

  onConfirmClick(): void {
    if (this.status == "REJECTED") {
      this.rejectedResponseHttp()
    }
    else if (this.status == "REMOVED") {
      this.removeAllocationHttp();
      this.navAllocation();
    }
    else if (this.status == "DELETE"){
      this.deleteUser();
      this.navAdminManagement();
    }
    this.dialogRef.close(true);
  }
  deleteUser(){
    this.httpService.deleteUserDetails(this.requestParam).subscribe({
      next: (response:any) => { 
        this.snackBService.openSnackBar(response.message, 'close')
      },
      error: () => { 
      }
    })
  }
  removeAllocationHttp() {
    this.httpService.removeAllocation(this.requestParam).subscribe((response: any) => {
      this.snackBService.openSnackBar(response.message, 'close')
    },
      (error: any) => {
      })
  }
  rejectedResponseHttp() {
    this.httpService.approvedOrRejectResponse(this.requestParam).subscribe({
      next: (res: any) => {
        this.snackBService.openSnackBar(res.message, 'close')
      },
      error: (error: any) => {
      }
    })
  }
  navToObjectionTracking() {
    this.router.navigate(NAVIGATION_URL_PATHS.OBJECTION_TRACKING_APPROVAL)
  }
  navAllocation() {
    this.router.navigate(NAVIGATION_URL_PATHS.ALLOCATION_LIST)
  }
  navAdminManagement(){
    this.router.navigate(NAVIGATION_URL_PATHS.ADMIN_MANAGEMENT)
  }
}