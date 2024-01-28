import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentInteractionService {
  private shareData: any = {};

  constructor() { }

  setData(attributeName: string, data: any): any {
    this.shareData = { ...this.shareData, [attributeName]: data };
    return this.shareData;
  }

  getData(): any {
    return this.shareData;
  }

  getAttribute(attributeName: string) {
    return this.shareData[attributeName] || null;
  }

  deleteAttribute(attributeName: string) {
    if (this.shareData[attributeName]) {
      delete this.shareData[attributeName]
    }
  }
}