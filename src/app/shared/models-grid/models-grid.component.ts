import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Model } from 'src/app/services/marks.service';

@Component({
  selector: 'app-models-grid',
  templateUrl: './models-grid.component.html',
  styleUrls: ['./models-grid.component.sass']
})
export class ModelsGridComponent implements OnInit {
  @Input() models: Model[];

  @Output() selectionModel: EventEmitter<Model> = new EventEmitter<Model>();

  constructor() { }

  ngOnInit(): void {
  }

  selectModel(model: Model) {
    this.selectionModel.emit(model);
  }

  getModelPrice(model: Model) { // pass to pipe
    const obj = model.attributes.find(a => a.name === 'Стоимость');

    return obj ? obj.value || '' : '';
  }
}
