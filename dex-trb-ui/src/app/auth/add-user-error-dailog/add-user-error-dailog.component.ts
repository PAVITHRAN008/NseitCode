import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';

@Component({
  selector: 'app-add-user-error-dailog',
  templateUrl: './add-user-error-dailog.component.html',
  styleUrls: ['./add-user-error-dailog.component.scss']
})
export class AddUserErrorDailogComponent implements OnInit {
  title: String = ''
  message: String = '';
  confirmButtonText: String = ''
  cancelButtonText: String = ''
  requestParam: any;
  status: any;
  action: any
  tabledata: any = []
  ELEMENT_DATA: any = []
  displayedColumns: string[] = ['name', 'identityNumber', 'status', 'errorDescription']
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  private tablePaginator!: MatPaginator;
  private tableSort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.tableSort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.tablePaginator = mp;
    this.setDataSourceAttributes();
  }
  loader: any = true;
  noRecordMessage: any = false;
  constructor(@Inject(MAT_DIALOG_DATA) data: any,) {
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
    this.ELEMENT_DATA = this.requestParam.responseContent
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.tablePaginator;
    this.dataSource.sort = this.tableSort;
  }
  setDataSourceAttributes() {
    if (this.tablePaginator && this.tableSort) {
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.tableSort;
    }
  }
}
