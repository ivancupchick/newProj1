import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mark, Model, MarksService, PresModule, PresModuleType } from 'src/app/services/marks.service';

@Component({
  selector: 'app-model-presentation',
  templateUrl: './model-presentation.component.html',
  styleUrls: ['./model-presentation.component.sass']
})
export class ModelPresentationComponent implements OnInit {
  PresModuleType = PresModuleType;
  mark: Mark;
  model: Model;
  price: string;

  modules: PresModule[];

  constructor(private route: ActivatedRoute, private marksService: MarksService) { }

  ngOnInit(): void {
    const markId = +this.route.snapshot.queryParamMap.get('idMark');
    const modelId = +this.route.snapshot.queryParamMap.get('idModel');
    // this.route.queryParamMap.subscribe(queryParams => {
    //   this.name = queryParams.get("paramName")
    // });

    this.marksService.getMarks().subscribe(marksWithKey => {
      const marks = marksWithKey.map(m => m.mark);
      this.mark = marks.find((m, i) => i === markId);
      console.log(this.mark);

      this.model = this.mark.models.find((m, i) => i === modelId);
      console.log(this.model);

      const priveObj = this.model.attributes.find(a => a.name === 'Стоимость');

      this.price = priveObj ? (priveObj.value || '10470') : '10470';

      this.modules = this.model.modulesInPres;

      // let allModels: Model[] = [];
      // this.marks.forEach(mark => {
      //   allModels = [...allModels, ...((mark && mark.models) || [])];
      // });
    });
  }

}
