import { Component, OnInit } from '@angular/core';
import { MarksService, Mark, Model } from 'src/app/services/marks.service';
import { Router } from '@angular/router';

interface ModelsTab {
  title: string;
  models: Model[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  marks: Mark[];

  tabs: ModelsTab[] = [{
    title: 'Кроссоверы', models: []
  }, {
    title: 'Универсалы', models: []
  }, {
    title: 'Седаны', models: []
  }, {
    title: 'Минивэны', models: []
  }, {
    title: 'Хэтчбэки', models: []
  }];

  markTabs: ModelsTab[];

  constructor(private marksService: MarksService, private router: Router) { }

  ngOnInit(): void {
    this.marksService.getMarks().subscribe(marks => {
      this.marks = marks.map(m => m.mark);

      this.markTabs = this.marks.map(m => ({ title: m.name, models: m.models }));

      const allModels: Model[] = [];
      this.marks.forEach(mark => {
        allModels.push(...mark.models);
      });

      allModels.forEach(model => {
        const type = (model.attributes || []).find(attribute => attribute.name === 'Тип кузова');
        const typeValue = type ? type.value : null;

        const pushModel = (title: string) => {
          const tab = this.tabs.find(t => t.title === title);
          tab.models.push(model);
        };

        switch (typeValue) {
          case 'Кроссовер': pushModel('Кроссоверы'); break;
          case 'Универсал': pushModel('Универсалы'); break;
          case 'Седан': pushModel('Седаны'); break;
          case 'Минивэн': pushModel('Минивэны'); break;
          case 'Хэтчбэк': pushModel('Хэтчбэки'); break;
        }
      });
    });
  }

  linkToModelPresentation(model: Model) {
    this.marks.find((ma, maI) => {
      const idMarkModel = ma.models.findIndex(mo => mo === model);

      if (idMarkModel !== -1) {
        this.router.navigateByUrl(`model-presentation?idMark=${maI}&idModel=${idMarkModel}`);
        return true;
      }
      return false;
    });
  }

}
