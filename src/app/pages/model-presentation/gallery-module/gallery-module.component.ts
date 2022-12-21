import { Component, OnInit, Input } from '@angular/core';
import { GalleryModuleData } from 'src/app/services/marks.service';

@Component({
  selector: 'app-gallery-module',
  templateUrl: './gallery-module.component.html',
  styleUrls: ['./gallery-module.component.sass']
})
export class GalleryModuleComponent implements OnInit {
  @Input() moduleData!: GalleryModuleData;

  constructor() { }

  ngOnInit(): void {
  }

}
