import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title-header',
  templateUrl: './title-header.component.html',
  styleUrls: ['./title-header.component.scss']
})
export class TitleHeaderComponent implements OnInit {
  @Input('titleHeader') titleHeader: string = '';
  
  constructor() { }
  ngOnInit(): void {
  }
}
