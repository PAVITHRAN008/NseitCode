import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as ENV } from 'src/environments/environment';
import { ComponentInteractionService } from './component-interaction.service';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private GET_SUBJECT = this.constructApiUrl('/lookup/section')
  private GET_STANDARD = this.constructApiUrl('/lookup/std')
  private GET_SESSION = this.constructApiUrl('/lookup/session')
  private GET_STATUS = this.constructApiUrl('/lookup/status/ALLOCATION')
  private GET_STATUS_APPROVAL = this.constructApiUrl('/lookup/status/APPROVAL')
  private GET_ACTION = this.constructApiUrl('/lookup/status/ACTION')
  private ADD_USER = this.adminApiUrl('/user/addUser')
  private DELETE_USER = this.adminApiUrl('/user/deleteUser')
  private UPDATE_USER = this.adminApiUrl('/user/updateUser')
  private BULK_UPLOAD = this.adminApiUrl('/user/bulkUserFileUpload')
  private GET_USERS = this.adminApiUrl('/user/getUserDetails')
  private GET_ALL_USERS = this.adminApiUrl('/user/getAllUserDetailsWithOutExpiry')
  private CHANGE_PASSWORD = this.adminApiUrl('/user/changePassword')
  private ADMIN_OBJECTION_VIEW = this.objectionApiUrl('/ObjectionQuestions/getObjectionsByQuestions')
  private SME_MODIFY_ANSWER = this.objectionApiUrl('/ObjectionQuestions/saveModifyAnswers')
  private DELETE_MODIFY_ANSWER = this.objectionApiUrl('/ObjectionQuestions/deleteModifyAnswers')
  private GET_APPROVED_DETAILS = this.allocationApiUrl('/allocation/getAllocations')
  private REMOVE_ALLOCATION = this.allocationApiUrl('/allocation/deleteAllocation')
  private SAVE_ALLOCATION = this.allocationApiUrl('/allocation/saveAllocations')
  private FILE_DOWNLOAD = this.allocationApiUrl('/allocation/downloadFile')
  private FILE_DELETE = this.allocationApiUrl('/allocation/deleteFile')
  private CANDIDATE_FILE_DOWNLOAD = this.objectionApiUrl('/ObjectionQuestions/downloadFile')
  private GET_ALLOCATIONS = this.aggregateApiUrl('/aggregate/allocation')
  private GET_APPROVAL = this.aggregateApiUrl('/aggregate/approval')
  private UPDATE_APPROVED_OR_REJECTED = this.allocationApiUrl('/allocation/updateApproval')
  private LOGIN = this.adminApiUrl('/user/loginAuth')
  private DASHBOARD_SUBJECT_DETAILS = this.aggregateApiUrl('/aggregate/dashboard/subject')
  private DASHBOARD_SME_DETAILS = this.aggregateApiUrl('/aggregate/dashboard/sme')
  private DASHBOARD_TITLES_DETAILS = this.aggregateApiUrl('/aggregate/dashboard/tiles')
  private SME_REPORT = this.aggregateApiUrl('/aggregate/reports/sme')
  private OBJECTION_SUMMARY_REPORT = this.aggregateApiUrl('/aggregate/reports/objsummary')
  private FINAL_SUMMARY_REPORT = this.aggregateApiUrl('/aggregate/reports/finalsummary')
  private OBJECTION_DETAILED_REPORT = this.aggregateApiUrl('/aggregate/reports/finalObjDtl')
  
  authorization: any;
  constructor(private http: HttpClient, private componentInteraction: ComponentInteractionService,) {
  }
  getUserCredentials() {
    let userName = this.componentInteraction.getAttribute('username')
    let password = this.componentInteraction.getAttribute('password')
    this.authorization = this.constructAuthorization(userName, password)
  }
  private constructAuthorization(userName: String, password: String) {
    let base64String = btoa(userName + ":" + password)
    return `Basic ${base64String}`
  }
  private constructApiUrl(url: any) {
    return `${ENV.API_URL_LOOKUP_SERVICE}${url}`
  }
  private adminApiUrl(url: any) {
    return `${ENV.ADMIN_MANAGEMENT_SERVICE}${url}`
  }
  private objectionApiUrl(url: any) {
    return `${ENV.OBJECTION_SERVICE}${url}`
  }
  private allocationApiUrl(url: any) {
    return `${ENV.ALLOCATION_SERVICE}${url}`
  }
  private aggregateApiUrl(url: any) {
    return `${ENV.AGGREGATE_SERVICE}${url}`
  }
  private constructHttpHeader(isBulkUpload?: any) {
    this.getUserCredentials()
    if (isBulkUpload) {
      let httpHeaders = new HttpHeaders({
        'Authorization': this.authorization
      });
      return httpHeaders
    }
    else {
      let httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.authorization
      });
      return httpHeaders
    }
  }
  private get(url: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getallUserDetails(url: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    httpHeaders = httpHeaders.append('role', 'SME');
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getUsersOnSubject(url: string, subject: any, identityNumber: any): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    if (subject != "")
      httpHeaders = httpHeaders.append('subject', subject);
    if (identityNumber != "") {
      httpHeaders = httpHeaders.append('identityNumber', identityNumber);
    }
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getObjectionQuestionDetails(url: string, questionId: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    httpHeaders = httpHeaders.append('objquesId', questionId.toString());
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getApprovedAllocationDetailByObjQuestionResponse(url: string, questionId: []): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    httpHeaders = httpHeaders.append('objQuestion', questionId);
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getSMEBySubjectResponse(url: string, subject: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader();
    httpHeaders = httpHeaders.append('subject', subject);
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  private getFileDownload(url: string, path: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader(true)
    httpHeaders = httpHeaders.append('filePath', path);
    return this.http.get<any>(url, { headers: httpHeaders, observe: 'response', responseType: 'blob' as 'json' });
  }
  private getCandidateFileDownload(url: string, path: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    httpHeaders = httpHeaders.append('filePath', path);
    return this.http.get<any>(url, { headers: httpHeaders, observe: 'response', responseType: 'blob' as 'json' });
  }
  private post(url: string, requestData: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, requestData, { headers: httpHeaders });
  }
  private postForSme(url: string, smeId: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let httpParams = new HttpParams()
    httpParams = httpParams.append('smeId', smeId)
    return this.http.post<any>(url, { headers: httpHeaders }, { params: httpParams });
  }
  private postForDashboard(url: string): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, { headers: httpHeaders });
  }
  private postForReports(url: string, requestData: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(url, requestData, { headers: httpHeaders });
  }
  private postForAddUsers(url: string, requestData: any): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    return this.http.post<any>(url, requestData, { headers: httpHeaders });
  }
  private postForBulkUsers(url: string, requestData: any): Observable<any> {
    let httpHeaders = this.constructHttpHeader(true)

    return this.http.post<any>(url, requestData, { headers: httpHeaders });
  }

  private put(url: string, requestData: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put<any>(url, requestData, { headers: httpHeaders });
  }
  private postFormData(url: string, requestData: any): Observable<any> {
    return this.http.post<any>(url, requestData);
  }
  private delete(url: any): Observable<any> {
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete<any>(url, { headers: httpHeaders })
  }
  private deleteUser(url: string): Observable<any> {
    let httpHeaders = this.constructHttpHeader()
    return this.http.delete<any>(url, { headers: httpHeaders })
  }
  getSubjectResponse(): Observable<any> {
    return this.get(this.GET_SUBJECT);
  }
  getStandardResponse(): Observable<any> {
    return this.get(this.GET_STANDARD);
  }
  getSessionResponse(): Observable<any> {
    return this.get(this.GET_SESSION)
  }
  getActionResponse(): Observable<any> {
    return this.get(this.GET_ACTION);
  }
  getStatusResponseForApproval(): Observable<any> {
    return this.get(this.GET_STATUS_APPROVAL);
  }
  getStatusResponse(): Observable<any> {
    return this.get(this.GET_STATUS);
  }
  addUserDetails(data: any): Observable<any> {
    return this.postForAddUsers(this.ADD_USER, data);
  }
  updateUser(data: any): Observable<any> {
    return this.postForAddUsers(this.UPDATE_USER, data)
  }
  deleteUserDetails(userId: any): Observable<any> {
    return this.deleteUser(this.DELETE_USER + "/" + userId)
  }
  bulkUploadUsers(file: any): Observable<any> {
    return this.postForBulkUsers(this.BULK_UPLOAD, file)
  }
  getAllUsersDetails(): Observable<any> {
    return this.getallUserDetails(this.GET_ALL_USERS)
  }
  getUsersBasedOnSubject(subject: any, identityNumber: any): Observable<any> {
    return this.getUsersOnSubject(this.GET_ALL_USERS, subject, identityNumber)
  }
  getAdminObjectionViewResponse(questionId: any): Observable<any> {
    return this.getObjectionQuestionDetails(this.ADMIN_OBJECTION_VIEW, questionId);
  }
  saveSMEModifyAnswer(requestParam: any): Observable<any> {
    return this.post(this.SME_MODIFY_ANSWER, requestParam);
  }
  getApprovedAllocationDetailByObjQuestion(questionId: any): Observable<any> {
    return this.getApprovedAllocationDetailByObjQuestionResponse(this.GET_APPROVED_DETAILS, questionId);
  }
  getAllocationDetails(requestParam: any): Observable<any> {
    return this.post(this.GET_ALLOCATIONS, requestParam);
  }
  getApprovalDetails(requestParam: any): Observable<any> {
    return this.post(this.GET_APPROVAL, requestParam);
  }
  removeAllocation(questionId: []): Observable<any> {
    return this.delete(this.REMOVE_ALLOCATION + '/' + questionId);
  }
  saveAllocation(requestParam: any): Observable<any> {
    return this.post(this.SAVE_ALLOCATION, requestParam);
  }
  approvedOrRejectResponse(data: any): Observable<any> {
    return this.postFormData(this.UPDATE_APPROVED_OR_REJECTED, data)
  }
  getSmeNameBySubject(subject: any): Observable<any> {
    return this.getSMEBySubjectResponse(this.GET_USERS, subject);
  }
  getFileDownloadResponse(path: any): Observable<any> {
    return this.getFileDownload(this.FILE_DOWNLOAD, path);
  }
  getCandidateFileDownloadResponse(path: any): Observable<any> {
    return this.getCandidateFileDownload(this.CANDIDATE_FILE_DOWNLOAD, path);
  }
  loginUserAuthentication() {
    return this.get(this.LOGIN)
  }
  getSubjectDetils() {
    return this.postForDashboard(this.DASHBOARD_SUBJECT_DETAILS)
  }
  getSmeDetails() {
    return this.postForDashboard(this.DASHBOARD_SME_DETAILS)
  }
  getTitleDetails() {
    return this.postForDashboard(this.DASHBOARD_TITLES_DETAILS)
  }
  getSmeReport(requestParam: any) {
    return this.postForReports(this.SME_REPORT, requestParam)
  }
  getObjectionSummaryReport(requestParam: any) {
    return this.postForReports(this.OBJECTION_SUMMARY_REPORT, requestParam)
  }
  getFinalSummaryReport(requestParam: any) {
    return this.postForReports(this.FINAL_SUMMARY_REPORT, requestParam)
  }
  getObjectionDetailedReport(requestParam: any) {
    return this.postForReports(this.OBJECTION_DETAILED_REPORT, requestParam)
  }
  getIndividualSmeDetails(smeId: any) {
    return this.postForSme(this.DASHBOARD_SME_DETAILS, smeId)
  }
  deleteDetailByObjQuestionResponse(subject: any): Observable<any> {
    return this.get(this.DELETE_MODIFY_ANSWER + '/' + subject);
  }
  deleteFileResponse(requestParam: any):  Observable<any> {
    return this.post(this.FILE_DELETE , requestParam);
  }
  setChangePassword(data: any): Observable<any> {
    return this.postForAddUsers(this.CHANGE_PASSWORD, data)
  }
}