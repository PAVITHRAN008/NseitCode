import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { Router } from '@angular/router';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { HttpService } from 'src/app/services/http.service';

export interface tableData {
  sNo: string;
  qtpCandAns: string;
  objectionText: string;
  objectionType: string;
  standard: string;
  subject: string;
  bookPageNo: string;
  documents: string;
}
@Component({
  selector: 'app-objection-table-candidate',
  templateUrl: './objection-table-candidate.component.html',
  styleUrls: ['./objection-table-candidate.component.scss']
})
export class ObjectionTableCandidateComponent implements OnInit, OnChanges {
  fromFinalObjection = false;
  opened = true;
  closed = false;
  userSearchInputs: any;
  panelOpenState = false;
  // paginateArray: any = [3, 5, 6, 10, 20];
  // paginateSize: any = this.paginateArray[0];
  @Input('viewDetails') viewDetails: any = [];
  displayedColumns: string[] = ['sNo', 'qtpCandAns', 'objectionType', 'objectionText', 'standard', 'subject', 'bookPageNo', 'documents'];
  dataSource = new MatTableDataSource<tableData>();
  private tablePaginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.tablePaginator = mp;
    this.setDataSourceAttributes();
  }
  private tableSort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.tableSort = ms;
    this.setDataSourceAttributes();
  }
  pathObjTracking = false
  constructor(private router: Router, private httpService: HttpService, private componentInteraction: ComponentInteractionService) {
    this.userSearchInputs = this.componentInteraction.getData();
    this.fromFinalObjection = this.componentInteraction.getAttribute('fromFinalObjection');
    this.setConfigForPDF();
  }
  setConfigForPDF() {
    if (this.fromFinalObjection) {
      // this.opened = false;
      // this.closed = true;
      this.panelOpenState = (this.fromFinalObjection) ? this.fromFinalObjection : this.panelOpenState
      // this.paginateSize = this.paginateArray[this.paginateArray.length - 1]
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewDetails'].currentValue) {
      this.viewDetails = changes['viewDetails'].currentValue;
      // let paginateLength = (this.paginateArray[this.paginateArray.length - 1] == this.viewDetails.length) ? true : false;
      // if (!paginateLength) {
      //   this.paginateArray.push(this.viewDetails.length);
      // }
      (this.fromFinalObjection) ? this.setConfigForPDF() : '';
      this.dataSource = new MatTableDataSource(this.viewDetails);
    }
  }
  ngOnInit() {
    this.dataSource.paginator = this.tablePaginator;
    this.dataSource.sort = this.tableSort
    this.pathObjTracking = (this.router.url == '/auth/objection-tracking-status') ? true : false
  }
  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  setDataSourceAttributes() {
    if (this.tablePaginator && this.tableSort) {
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.tableSort;
    }
  }

  fileDownload(path: any) {
    this.httpService.getCandidateFileDownloadResponse(path).subscribe({
      next: (res: any) => {
        const data = res.body;
        const blob = new Blob([data], { type: res.body.type });
        this.save(blob, this.getFileName(res.headers, path));
      },
      error: (error: any) => {
      }
    })

  }
  private getFileName(headers: HttpHeaders, UploadedFileName: string) {
    const contentDisposition = headers.get('Content-Disposition') || '';
    let matches: any = /filename=([^;]+)/ig.exec(contentDisposition);
    matches = (matches != null) ? matches[1] : UploadedFileName;
    const fileName: any = (matches || 'file.zip').trim();
    return fileName;
  }
  save(data: Blob, name: string) {
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(data);
    a.setAttribute('target', '_blank');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
