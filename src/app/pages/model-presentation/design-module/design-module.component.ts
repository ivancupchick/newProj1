import { Component, OnInit, Input } from '@angular/core';
import { DesignModuleData } from 'src/app/services/marks.service';

@Component({
  selector: 'app-design-module',
  templateUrl: './design-module.component.html',
  styleUrls: ['./design-module.component.sass']
})
export class DesignModuleComponent implements OnInit {
  @Input() moduleData: DesignModuleData;

  constructor() { }

  ngOnInit(): void {
  }

}
