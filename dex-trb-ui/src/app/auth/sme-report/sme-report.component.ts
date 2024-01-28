import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-sme-report',
  templateUrl: './sme-report.component.html',
  styleUrls: ['./sme-report.component.scss']
})
export class SmeReportComponent implements OnInit {
  searchForm!: FormGroup
  tabledata: any = []
  selectedSubject!: string;
  selectedSmeName!: string;
  selectedExamName!: string;
  selectedExamDate!: string;
  selectedBatchTime!: string;
  selectedMasterQp!: string;
  displayedColumns: string[] = ['id', 'examName', 'smeName', 'date', 'batch', 'subject', 'qstnAssigned', 'qstnCompleted']
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
  constructor(private httpService: HttpService, private globalService: GlobalUseService,) { }

  ngOnInit(): void {
    this.loader = true;
  }
  setDataSourceAttributes() {
    if (this.tablePaginator && this.tableSort) {
      this.dataSource.paginator = this.tablePaginator;
      this.dataSource.sort = this.tableSort;
    }
  }
  applyFilter(event: any) {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }
  importAsXlsx() {
    this.matTableExporter.exportTable('xlsx', { fileName: this.globalService.getFileName('Export').fileName, sheet: this.globalService.getFileName('Export').sheetName })
  }
  getChildFormData(event?: any) {
    this.loader = true;
    if (event) {
      this.selectedSubject = event.subject;
      this.selectedSmeName = event.smeName;
      this.selectedExamName = event.examName;
      this.selectedExamDate = event.date;
      this.selectedBatchTime = event.batch;
      this.selectedMasterQp = event.masterQP;
      this.getSmeReportDetails(event)
    }
  }
  getSmeReportDetails(event: any) {
    this.noRecordMessage = false;
    this.tabledata = [];
    let ELEMENT_DATA: any = []
    let requestParam: any = {}
    if (event) {
      requestParam.subject = event.subject
      requestParam.smeName = event.smeName
      requestParam.examName = event.examName
      requestParam.date = event.date
      requestParam.batch = event.batch
      requestParam.masterQP = event.masterQP
    }

    this.httpService.getSmeReport(requestParam).subscribe({
      next: (res: any) => {
        if (res.statuscode == "SUCC_000") {
          this.loader = false;
          this.tabledata = res.reportsBySme;
          this.noRecordMessage = (this.tabledata.length == 0) ? true : false;
          if (!this.noRecordMessage) {
            let newObj = {};
            res.reportsBySme.map((val: any, index: number) => {
              newObj = {
                ...newObj,
                id: index + 1,
                subject: val.subject, date: val.date, examName: val.examName, qstnAssigned: val.qstnAssigned,
                qstnCompleted: val.qstnCompleted, smeName: val.smeName, batch: val.batch
              }
              ELEMENT_DATA.push(newObj)
            })
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.dataSource.paginator = this.tablePaginator;
            this.dataSource.sort = this.tableSort;
          }
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
}
