import { Injectable } from '@angular/core';
import { table } from 'console';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { logoImage } from '../services/image-service'
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {
  tableDataRes: any = [];

  constructor() { }

  filterData(data: any) {
    //this.tableDataRes = tableDataFromPdf;
    data.map((tableDataFromPdf: any) => {
      console.log(data)
      tableDataFromPdf.questions.sort((a: any, b: any) => {
        if (a.language == "ENGLISH") {
          a.sortId = -1
        }
        return a.sortId - b.sortId;
      })
      if (tableDataFromPdf.subject == 'Language-I') {
        let tempQuestion = tableDataFromPdf.questions[1];
        tableDataFromPdf.questions = [];
        tableDataFromPdf.questions.push(tempQuestion);
      }
      if (tableDataFromPdf.subject == 'Language-II') {
        let tempQuestionLangII = tableDataFromPdf.questions[0];
        tableDataFromPdf.questions = [];
        tableDataFromPdf.questions.push(tempQuestionLangII);
      }
      this.tableDataRes.push(tableDataFromPdf);
    })
    // return this.tableDataRes
  }
  generatePDF(tableData: any) {
    this.tableDataRes = tableData;
    // this.filterData(tableData);
    let docDefinition: any = {
      content: this.tableDataRes.map((tableVal: any) => {
        // tableVal.questions.sort((a: any, b: any) => {
        //   if (a.language == "ENGLISH") {
        //     a.sortId = -1
        //   }
        //   return a.sortId - b.sortId;
        // })
        // if (tableVal.subject == 'Language-I') {
        //   let tempQuestion = tableVal.questions[1];
        //   tableVal.questions = [];
        //   tableVal.questions.push(tempQuestion);
        // }
        // if (tableVal.subject == 'Language-II') {
        //   let tempQuestionLangII = tableVal.questions[0];
        //   tableVal.questions = [];
        //   tableVal.questions.push(tempQuestionLangII);
        // }
        return [
          {
            columns: [
              {
                image: logoImage,
                fit: [70, 70],
                alignment: 'center',
              },
            ],
          },
          {
            columns: [
              {
                width: '90%',
                text: 'Objection Status',
                color: 'grey'
              },
              {
                text: tableVal.status,
              }
            ],
            style: 'sectionHeader'
          },
          {
            columns: [
              {
                width: '45%',
                text: 'Module Name: ' + tableVal.moduleName
              },
              {
                width: '28%',
                text: 'Date: ' + tableVal.examDate
              },
              {
                width: '27%',
                text: 'Batch: ' + tableVal.examBatch
              },
            ],
            style: 'columnStyle',
            margin: [0, 10, 0, 10]
          },
          {
            columns: [
              {
                width: '73%',
                text: 'Subject: ' + tableVal.subject,
              },
              {
                width: '27%',
                text: 'Master QP: ' + tableVal.clientId
              }
            ],
            style: 'columnStyle',
          },
          {
            columns: [
              {
                width: '5%',
                text: 'Note: ',
              },
              {
                width: '12%',
                text: 'Existing Answer, ',
                color: 'blue',
              },
              {
                width: '12%',
                text: 'Modify Answer,',
                color: 'green',
              },
              {
                width: '17%',
                text: 'Existing & Modify Answer, ',
                color: 'orange',
              },
              {
                width: '8%',
                text: ' Default',
              },
            ],
            columnGap: -3,
            style: 'fontMedium'
          },
          tableVal.questions.map((item: any) => {
            let concatString: any;
            let languageStyle: any;
            let colObj: any = {};
            let colArray: any = [];
            let imgObj: any = {};
            languageStyle = (item.language == "TAMIL") ? 'questionAreaTamil' : (item.language == "TELUGU") ? 'questionAreaPottiSeeramulu' : (item.language == "URDU") ? 'questionAreaUrdu' : (item.language == "KANNADA") ? 'questionAreaKannada' : (item.language == "MALAYALAM") ? 'questionAreaMalayalam' : 'questionArea';
            concatString = "data:image/jpeg;base64," + item.qstImage
            colObj = { ...colObj, text: tableVal.clientId + '. ' + item.questionsDescription + '\n\n', fontSize: 11, style: languageStyle }
            colArray.push(colObj);
            if (item.qstImage) {
              imgObj = { ...imgObj, image: concatString, fit: [300, 300], margin: [13, 10, 10, 10], }
              colArray.push(imgObj)
            }
            item.options.map((opt: any) => {
              let imgObjOption: any = {}
              if (opt.qstCrctAnsId == opt.optionId && opt.modAnsId == opt.optionId) {
                colObj = { ...colObj, text: opt.option + '. ' + opt.optionDescription + '\n\n', fontSize: 10, color: 'orange', margin: [13, 0, 0, 0], style: languageStyle }
              }
              else if (opt.qstCrctAnsId == opt.optionId) {
                colObj = { ...colObj, text: opt.option + '. ' + opt.optionDescription + '\n\n', fontSize: 10, color: 'blue', margin: [13, 0, 0, 0], style: languageStyle }
              }
              else if (opt.modAnsId == opt.optionId) {
                colObj = { ...colObj, text: opt.option + '. ' + opt.optionDescription + '\n\n', fontSize: 12, bold: true, color: 'green', margin: [13, 0, 0, 0], style: languageStyle }
              }
              else {
                colObj = { ...colObj, text: opt.option + '. ' + opt.optionDescription + '\n\n', fontSize: 10, color: 'black', margin: [13, 0, 0, 0], style: languageStyle }
              }
              colArray.push(colObj);
              if (opt.qstOptionImage) {
                imgObjOption = { ...imgObjOption, image: "data:image/jpeg;base64," + opt.qstOptionImage + '\n\n', margin: [13, 0, 0, 0] }
                colArray.push(imgObjOption);
              }
            })
            return colArray;
          }),
          {
            columns: [
              {
                width: '40%',
                text: 'Action: ' + tableVal.action,
              },
              {
                width: '60%',
                text: 'Subject: ' + tableVal.subject,
              }
            ],
            style: 'columnStyle',
            columnGap: 1,
            margin: [0, 10, 0, 0]
          },
          {
            columns: [
              {
                width: '40%',
                text: 'Standard: ' + tableVal.standard,
              },
              {
                width: '60%',
                text: 'Page No: ' + tableVal.pageNo
              },

            ],
            style: 'columnStyle',
            columnGap: 1,
            margin: [0, 10, 0, 10]
          },
          {
            text: 'Remarks: ' + tableVal.remarks,
            fontSize: 9,
            margin: [0, 0, 0, 10]
          },
          {
            text: 'List of objection by candidate',
            fontSize: 11,
            bold: true,
            decoration: 'underline',
            margin: [0, 10, 0, 10]
          },
          {
            style: 'table',
            table: {
              widths: ['auto', 'auto', 'auto', 'auto', '25%', '5%', 'auto', '10%', 'auto'],
              body: [
                [
                  'Sno', 'MasterQP', 'Candidate Answer', 'Objection Type', 'Objection Text', 'Std', 'Subject', 'Doc', 'Page No',
                ]
              ]
                .concat(tableVal.candidateObjctions.map((val: any, i: any) => [i + 1, val.clientId, val.qtpCandAns, val.objectionType, val.objectionText, (val.standard) ? val.standard : '', val.subject, val.fileName, val.bookPageNo]))
            }
          },
          { text: '', pageBreak: 'after' }
        ]
      }),
      styles: {
        questionArea: {
          border: '1px solid gray',
        },
        table: {
          fontSize: 8,
          alignment: 'left',
          color: 'black',
          margin: [0, 5, 0, 15]
        },
        questionAreaTamil: {
          border: '1px solid gray',
          font: 'NotoSerifTamil'
        },
        questionAreaUrdu: {
          border: '1px solid gray',
          font: 'JameelNooriNastaleeqKasheeda'
        },
        // questionAreaTelugu: {
        //   border: '1px solid gray',
        //   font: 'NotoSerifTelugu'
        // },
        questionAreaKannada: {
          border: '1px solid gray',
          font: 'NotoSerifKannada'
        },
        questionAreaMalayalam: {
          border: '1px solid gray',
          font: 'NotoSerifMalayalam'
        },
        questionAreaPottiSeeramulu: {
          border: '1px solid gray',
          font: 'PottiSreeramuluRegular'
        },
        fontMedium: {
          fontSize: 7.5,
          bold: false,
          margin: [0, 10, 0, 10]
        },
        columnStyle: {
          fontSize: 10,
          bold: false
        },
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 10, 10, 10]
        }
      },
    };
    (pdfMake as any).fonts = {
      "Roboto": {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
      },
      "NotoSerifTamil": {
        normal: `${window.location.origin}/ui/assets/fonts/NotoSerifTamil/NotoSerifTamil-Regular.ttf`,
        bold: `${window.location.origin}/ui/assets/fonts/NotoSerifTamil/NotoSerifTamil-Medium.ttf`,
        italics: `${window.location.origin}/ui/assets/fonts/NotoSerifTamil/NotoSerifTamil-Medium.ttf`,
        bolditalics: `${window.location.origin}/ui/assets/fonts/NotoSerifTamil/NotoSerifTamil-Medium.ttf`
      },
      // "NotoSerifTelugu": {
      //   normal: `${window.location.origin}/ui/assets/fonts/NotoSerifTelugu/NotoSerifTelugu-Regular.ttf`,
      //   bold: `${window.location.origin}/ui/assets/fonts/NotoSerifTelugu/NotoSerifTelugu-Medium.ttf`,
      //   italics: `${window.location.origin}/ui/assets/fonts/NotoSerifTelugu/NotoSerifTelugu-Medium.ttf`,
      //   bolditalics: `${window.location.origin}/ui/assets/fonts/NotoSerifTelugu/NotoSerifTelugu-Medium.ttf`
      // },
      // "NotoNastaliqUrdu": {
      //   normal: `${window.location.origin}/ui/assets/fonts/NotoNastaliqUrdu/NotoNastaliqUrdu-Regular.ttf`,
      //   bold: `${window.location.origin}/ui/assets/fonts/NotoNastaliqUrdu/NotoNastaliqUrdu-Medium.ttf`,
      //   italics: `${window.location.origin}/ui/assets/fonts/NotoNastaliqUrdu/NotoNastaliqUrdu-Medium.ttf`,
      //   bolditalics: `${window.location.origin}/ui/assets/fonts/NotoNastaliqUrdu/NotoNastaliqUrdu-Medium.ttf`
      // },
      "NotoSerifKannada": {
        normal: `${window.location.origin}/ui/assets/fonts/NotoSerifKannada/NotoSerifKannada-Regular.ttf`,
        bold: `${window.location.origin}/ui/assets/fonts/NotoSerifKannada/NotoSerifKannada-Medium.ttf`,
        italics: `${window.location.origin}/ui/assets/fonts/NotoSerifKannada/NotoSerifKannada-Medium.ttf`,
        bolditalics: `${window.location.origin}/ui/assets/fonts/NotoSerifKannada/NotoSerifKannada-Medium.ttf`
      },
      "NotoSerifMalayalam": {
        normal: `${window.location.origin}/ui/assets/fonts/NotoSerifMalayalam/NotoSerifMalayalam-Regular.ttf`,
        bold: `${window.location.origin}/ui/assets/fonts/NotoSerifMalayalam/NotoSerifMalayalam-Medium.ttf`,
        italics: `${window.location.origin}/ui/assets/fonts/NotoSerifMalayalam/NotoSerifMalayalam-Medium.ttf`,
        bolditalics: `${window.location.origin}/ui/assets/fonts/NotoSerifMalayalam/NotoSerifMalayalam-Medium.ttf`
      },
      "PottiSreeramuluRegular": {
        normal: `${window.location.origin}/ui/assets/fonts/pottiSeeramuluTelugu/PottiSreeramuluRegular.otf`,
        bold: `${window.location.origin}/ui/assets/fonts/pottiSeeramuluTelugu/PottiSreeramuluRegular.otf`,
        italics: `${window.location.origin}/ui/assets/fonts/pottiSeeramuluTelugu/PottiSreeramuluRegular.otf`,
        bolditalics: `${window.location.origin}/ui/assets/fonts/pottiSeeramuluTelugu/PottiSreeramuluRegular.otf`
      },
      "JameelNooriNastaleeqKasheeda": {
        normal: `${window.location.origin}/ui/assets/fonts/JameelNooriNastaleeqKasheeda/JameelNooriNastaleeqKasheeda.ttf`,
        bold: `${window.location.origin}/ui/assets/fonts/JameelNooriNastaleeqKasheeda/JameelNooriNastaleeqKasheeda.ttf`,
        italics: `${window.location.origin}/ui/assets/fonts/JameelNooriNastaleeqKasheeda/JameelNooriNastaleeqKasheeda.ttf`,
        bolditalics: `${window.location.origin}/ui/assets/fonts/JameelNooriNastaleeqKasheeda/JameelNooriNastaleeqKasheeda.ttf`
      }
    }
    pdfMake.createPdf(docDefinition, undefined, (pdfMake as any).fonts).download('Final_Objection_Report_txt-pdf.pdf');
  }
  //convertUnicodeToString(uniCode: any, language: any) {
  // if (language == "ENGLISH") {
  //  return uniCode
  //}
  // else {
  //   return uniCode.split(';').map((val: any) => String.fromCharCode(parseInt(val.replace("&#", '')))).join('')
  // }
  //}
}
