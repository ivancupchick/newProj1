import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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

  objectPosition: 'center';

  modules: PresModule[];

  @ViewChild('image', { static: true }) imageRef: ElementRef;

  constructor(private route: ActivatedRoute, private marksService: MarksService, private renderer: Renderer2) { }

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

        this.model = this.mark.models.find((m, i) => i === modelId);

        this.renderer.setStyle(
          this.imageRef.nativeElement,
          'object-position',
          `${this.model.presPhotoHorizontalPosition} ${this.model.presPhotoVerticalPosition}`
        );

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
