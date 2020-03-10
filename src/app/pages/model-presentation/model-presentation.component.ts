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
    this.route.queryParamMap.subscribe(params => {
      const markId = +params.get('idMark');
      const modelId = +params.get('idModel');
      if (markId === undefined || Number.isNaN(markId)) {
        return;
      }
      // this.route.queryParamMap.subscribe(queryParams => {
      //   this.name = queryParams.get("paramName")
      // });

      this.marksService.getMarks().subscribe(marksWithKey => {
        if (!marksWithKey || marksWithKey.length === 0) {
          return;
        }

        const marks = marksWithKey.map(m => m.mark);
        this.mark = marks.find((m, i) => i === markId);
        console.log(this.mark);

        this.model = this.mark.models.find((m, i) => i === modelId);
        console.log(this.model);

        const priveObj = this.model.attributes.find(a => a.name === 'Стоимость');

        this.price = priveObj ? (priveObj.value || '10470') : '10470';

        this.modules = this.model.modulesInPres;

        console.log(this.model.modulesInPres);

        // let allModels: Model[] = [];
        // this.marks.forEach(mark => {
        //   allModels = [...allModels, ...((mark && mark.models) || [])];
        // });
      });
    });
  }

}
