import { Component, OnInit } from '@angular/core';
import { MarksService, Mark, Model } from 'src/app/services/marks.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  marks: Mark[];

  tabs: { title: string, models: Model[] }[] = [{
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

  constructor(private marksService: MarksService, private router: Router) { }

  ngOnInit(): void {
    this.marksService.getMarks().subscribe(marks => {
      this.marks = marks;

      const allModels: Model[] = [];
      marks.forEach(mark => {
        allModels.push(...mark.models);
      });

      allModels.forEach(model => {
        const type = model.attributes.find(attribute => attribute.name === 'Тип кузова').value;

        const pushModel = (title: string) => {
          const tab = this.tabs.find(t => t.title === title);
          tab.models.push(model);
        };

        switch (type) {
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
