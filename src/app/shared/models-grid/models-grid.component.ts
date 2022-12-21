import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Model } from 'src/app/services/marks.service';

@Component({
  selector: 'app-models-grid',
  templateUrl: './models-grid.component.html',
  styleUrls: ['./models-grid.component.sass']
})
export class ModelsGridComponent implements OnInit {
  @Input() inHeader = false;
  @Input() models: Model[] = [];

  isAvailableModel4 = true;
  isAvailableModel3 = true;

  @Output() selectionModel: EventEmitter<Model> = new EventEmitter<Model>();

  constructor() { }

  ngOnInit(): void {
    if (this.inHeader) {
      const viewportWidth = window.innerWidth;

      if (viewportWidth < 950 && viewportWidth > 798) {
        this.isAvailableModel4 = false;
      } else if (viewportWidth < 798) {
        this.isAvailableModel3 = false;
      }
    }
  }

  selectModel(model: Model) {
    this.selectionModel.emit(model);
  }

  getModelPrice(model: Model) { // pass to pipe
    const obj = model.attributes ? model.attributes.find(a => a.name === 'Стоимость') : null;

    return obj && obj.value ? `от ${obj.value} BYN` : '';
  }
}
