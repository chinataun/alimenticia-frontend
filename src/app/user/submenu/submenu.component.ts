import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubmenuComponent implements OnInit {

  @Input() userId!: number;

  constructor() { }

  ngOnInit(): void {
  }

}