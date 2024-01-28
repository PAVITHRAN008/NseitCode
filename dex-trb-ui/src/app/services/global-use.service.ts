import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalUseService {

  constructor() { }

  getFileName(name: string) {
    let timeSpan = new Date().toISOString();
    let sheetName = name.substring(0, 31);
    let fileName = `${sheetName}-${timeSpan}`;
    return {
      sheetName,
      fileName
    };
  };
}
