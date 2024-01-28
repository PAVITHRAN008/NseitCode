import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-title-header',
  templateUrl: './table-title-header.component.html',
  styleUrls: ['./table-title-header.component.scss']
})
export class TableTitleHeaderComponent implements OnInit {
  @Input('tableHeader') tableHeader: string = ''
  constructor() { }

  ngOnInit(): void {
  }

}
