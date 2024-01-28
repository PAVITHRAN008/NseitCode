import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { GlobalUseService } from 'src/app/services/global-use.service';
import { HttpService } from 'src/app/services/http.service';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';
import { PdfGenerationService } from 'src/app/services/pdf-generation.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { logoImage } from '../../services/image-service'
@Component({
  selector: 'app-objection-detailed-report',
  templateUrl: 'objection-detailed-report.component.html',
  styleUrls: ['objection-detailed-report.component.scss']
})
export class ObjectionDetailedReportComponent implements OnInit {

  tableData: boolean = false
  logoImage: any = logoImage;
  pdf: any = jsPDF;
  length: any;
  counter: any;
  selectedSubject!: string;
  selectedSmeName!: string;
  selectedExamName!: string;
  selectedExamDate!: string;
  selectedBatchTime!: string;
  selectedMasterQp!: string;
  tableDatas: any = []
  tableDatasTextToPdf: any = [];
  disabledDownloadBtn = false;
  multipleAnswerKey = "MULTIPLE_ANSWER_KEY";
  answerKeyChange = "ANSWER_KEY_CHANGE";
  displayedColumns: string[] = ['id', 'examName', 'subject', 'qstNo', 'crctAns', 'noofObjections', 'modQuesOption', 'action', 'status', 'remarks']
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatTableExporterDirective) matTableExporter!: MatTableExporterDirective;
  private tablePaginator!: MatPaginator;
  private tableSort!: MatSort;
  viewDetailsCollections: any = [];
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
  constructor(private pdfService: PdfGenerationService, private componentInteraction: ComponentInteractionService, private httpService: HttpService, private globalService: GlobalUseService,) { }

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
      this.getObjectionDetailedReportDetails(event)
    }
  }
  getObjectionDetailedReportDetails(event: any, isReload?: any) {
    this.noRecordMessage = false;
    this.tableDatas = [];
    let requestParam: any = {}
    if (event) {
      requestParam.subject = event.subject
      requestParam.smeName = event.smeName
      requestParam.examName = event.examName
      requestParam.date = event.date
      requestParam.batch = event.batch
      requestParam.masterQP = event.masterQP
    }

    this.httpService.getObjectionDetailedReport(requestParam).subscribe({
      next: (res: any) => {
        if (res.statuscode == "SUCC_000") {
          this.loader = false;

          this.tableDatas = res.reportsFinalObjDtl;
          this.tableDatasTextToPdf = res.reportsFinalObjDtl;
          this.componentInteraction.setData('fromFinalObjection', true);

          this.tableDatas.map((val: any) => {
            this.setSno(val.candidateObjctions);
            val.questions.sort((a: any, b: any) => {
              if (a.language == "ENGLISH") {
                a.sortId = -1
              }
              return a.sortId - b.sortId;
            })
            if (val.subject == 'Language-I') {
              let tempQuestionObject = val.questions[1];
              tempQuestionObject.firstLanguage = true;
              val.questions = [];
              val.questions.push(tempQuestionObject)
            }
            if (val.subject == 'Language-II') {
              let tempQuestionObject = val.questions[0];
              tempQuestionObject.firstLanguage = true;
              val.questions = [];
              val.questions.push(tempQuestionObject)
            }
          })

          this.noRecordMessage = (this.tableDatas.length == 0) ? true : false;
        }
        else {
          this.noRecordMessage = true;
          this.loader = false;
        }
      }
    })
  }
  downloadTextToPdf() {
    this.pdfService.generatePDF(this.tableDatasTextToPdf)
  }
  // downloadPDF() {
  //   this.pdf = new jsPDF('p', 'mm', 'a4') // A4 size page of PDF
  //   this.length = this.tableDatas.length
  //   this.counter = 0;
  //   //  this.viewDetailsCollections.map((val: any) => {
  //   this.generatePDF()
  //   //  })
  // } 
  generatePDF() {
    return new Promise((resolve, reject) => {
      this.loader = true;
      this.length = this.tableDatas.length
      var doc = new jsPDF('p', 'mm', "a4");

      // let pdf = new jsPDF('p', 'mm', 'a4') // A4 size page of PDF

      this.tableDatas.map((val: any, index: any) => {
        let data: any = document.getElementById('pdf' + index)
        // let iframe: any = document.createElement('iframe');
        //document.body.appendChild(iframe);
        // setTimeout(() => {
        //var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        //iframedoc.body.innerHTML = data;
        html2canvas(data).then((canvas) => {
          // canvas.getContext('2d');
          var imgWidth = 208 - 2 * 3;
          var pageHeight = 297;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;

          // var doc = new jsPDF('p', 'mm');
          var position = 0;
          var imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData, 'PNG', 3, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
         doc.setFont('bold')
          // Few necessary setting options
          // var imgWidth = 208
          // var imgHeight = (canvas.height * imgWidth) / canvas.width;
          // var imgWidth = this.pdf.internal.pageSize.getWidth();
          // var imgHeight = this.pdf.internal.pageSize.getHeight();
          //const contentDataURL = canvas.toDataURL('image/jpeg')
          // var position = 0
          // const imgWidth = 208 - 2 * 5;
          // const pageHeight = 295;
          // const imgHeight = (canvas.height * imgWidth / canvas.width);
          // let heightLeft = imgHeight;
          // const contentDataURL = canvas.toDataURL('image/png');
          // let position = 0;
          //pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
          //heightLeft -= pageHeight;
          // pdf.setFontSize(8);
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 3, position, imgWidth, imgHeight + 15);
            heightLeft -= pageHeight;
          }
          // pdf.addImage(contentDataURL, 'JPEG', 0, 0, imgWidth, imgHeight)
          //this.pdf.addPage()
          if (this.tableDatas.length - 1 == index) {
            doc.save('Final_objection_report_html-pdf.pdf') // Generated PDF
            //document.body.appendChild(canvas);
            //document.body.removeChild(iframe);
            // window.open(this.pdf.output('bloburl', { filename: 'new-file.pdf' }), '_blank');
          }
          else {
            doc.addPage()
           // doc.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight + 15);
          }
        })
        // }, 10);
      })
      resolve('');
    });
    // // if (isBoolean) {    
  }
  stopLoader() {
    this.loader = false;
    this.disabledDownloadBtn = false;
  }
  downloadHtmlToPdf() {
    this.disabledDownloadBtn = true
    this.generatePDF().then((res: any) => {
      this.stopLoader();
    })
  }
  setSno(viewObjectionDetails: any) {
    viewObjectionDetails.map((val: any, index: number) => {
      val.sNo = index + 1;
    })
  }
}