import { Component, OnInit } from '@angular/core';
import { ComponentInteractionService } from 'src/app/services/component-interaction.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title: any
  constructor(private componentInteraction: ComponentInteractionService) { }

  ngOnInit(): void {
    let name = this.componentInteraction.getAttribute('name');
    this.title = name
  }
}
