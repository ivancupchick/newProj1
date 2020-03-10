import { Component, OnInit, Input } from '@angular/core';
import { EquipmentModuleData } from 'src/app/services/marks.service';

@Component({
  selector: 'app-equipment-module',
  templateUrl: './equipment-module.component.html',
  styleUrls: ['./equipment-module.component.sass']
})
export class EquipmentModuleComponent implements OnInit {
  @Input() moduleData: EquipmentModuleData;

  constructor() { }

  ngOnInit(): void {
  }

}
