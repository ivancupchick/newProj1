import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarksService, Mark, Model, Comp } from 'src/app/services/marks.service';
import { SelectItem } from 'primeng/api/selectitem';



@Component({
  selector: 'app-finance-calculator',
  templateUrl: './finance-calculator.component.html',
  styleUrls: ['./finance-calculator.component.sass']
})
export class FinanceCalculatorComponent implements OnInit {
  marksDropdown!: SelectItem[];
  selectedMark: string = '';

  modelDropdown!: SelectItem[];
  selectedModel: string = '';

  compDropdown!: SelectItem[];
  selectedComp: string = '';

  currentMark!: Mark;
  currentModel!: Model;
  currentComp!: Comp;

  allMarks!: Mark[];

  constructor(private route: ActivatedRoute, private marksService: MarksService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const markId = +(params.get('mark') || 0);
      const modelId = +(params.get('model') || 0);
      const compId = +(params.get('comp') || 0);

      if (markId) {

        if (modelId) {

          if (compId) {

          }
        }
      }

      // this.route.queryParamMap.subscribe(queryParams => {
      //   this.name = queryParams.get("paramName")
      // });

      this.marksService.getMarks().subscribe(marksWithKey => {
        if (!marksWithKey || marksWithKey.length === 0) {
          return;
        }

        const marks = marksWithKey.map(m => m.mark);
        this.allMarks = marks;

        this.marksDropdown = [...marks.map(c => ({ label: c.name, value: c.name }))];
        // }, {
        //   label: 'Дизель',
        //   value: FuelEnum.diesel

        // this.mark = marks.find((m, i) => i === markId);

        // this.model = this.mark.models.find((m, i) => i === modelId);

        // this.renderer.setStyle(
        //   this.imageRef.nativeElement,
        //   'object-position',
        //   `${this.model.presPhotoHorizontalPosition} ${this.model.presPhotoVerticalPosition}`
        // );

        // const priveObj = this.model.attributes.find(a => a.name === 'Стоимость');

        // this.price = priveObj ? (priveObj.value || '10470') : '10470';

        // this.modules = this.model.modulesInPres;

        // console.log(this.model.modulesInPres);

        // let allModels: Model[] = [];
        // this.marks.forEach(mark => {
        //   allModels = [...allModels, ...((mark && mark.models) || [])];
        // });
      });
    });
  }

  changeMark() {
    const selectedMark = this.allMarks.find(m => m.name === this.selectedMark);

    if (selectedMark && selectedMark.models) {
      this.currentMark = selectedMark;
      this.modelDropdown = [...selectedMark.models.map(m => ({ label: m.name, value: m.name }))];
    }
  }

  changeModel() {
    const selectedModel = this.currentMark.models.find(m => m.name === this.selectedModel);

    if (selectedModel && selectedModel.comps) {
      this.currentModel = selectedModel;
      this.compDropdown = [...selectedModel.comps.map(m => ({ label: m.name, value: m.name }))];
    }
  }

  changeComp() {
    const selectedComp = this.currentModel.comps.find(m => m.name === this.selectedComp);

    if (selectedComp) {
      this.currentComp = selectedComp;
      // this.currentModel = selectedModel;
      // this.compDropdown = [...selectedModel.comps.map(m => ({ label: m.name, value: m.name }))];
    }
  }

  historyFirstTemplate = (n: number) => {
    return n === 0 ? 'Минимальный платеж' : 'Минимальная переплата';
  }

  percentageTemplate = (n: number) => {
    return n % 10 === 0 ? `${n}%` : '';
  }

  periodTemplate = (n: number) => {
    return n % 12 === 0 ? `${n}` : '';
  }
}
