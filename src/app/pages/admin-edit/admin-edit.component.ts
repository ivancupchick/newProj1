import { Component, OnInit } from '@angular/core';
import { Mark, Model, MarksService, MarkWithKey } from 'src/app/services/marks.service';
import { AttributesService } from 'src/app/services/attributes.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.sass']
})
export class AdminEditComponent implements OnInit {
  markWithKey: MarkWithKey[];
  marks: Mark[];

  newAttributeName: string;

  isShowCreateMarkForm = false;

  newMark: Mark = {
    name: '',
    description: '',
    models: []
  };

  attributes: string[];

  constructor(private attributesService: AttributesService, private uploadService: UploadService, private marksService: MarksService) { }

  ngOnInit(): void {
    this.marksService.getMarks().subscribe(m => {
      this.markWithKey = m;
      console.log(m.map(mm => mm.mark));
      this.marks = m.map(mm => mm.mark);
    });

    this.attributesService.getAttributes().subscribe(attributes => {
      this.attributes = [...attributes];
    });
  }

  createModel(mark: Mark) {
    mark.models.push({
      name: '',
      description: '',
      mainPhoto: {
        url: '',
        filePathFirebase: ''
      },
      photos: [],
      comps: [],
      attributes: [{
        name: 'Тип кузова',
        value: ''
      }]
    });
  }

  createComp(model: Model) {
    model.comps.push({
      name: '',
      description: ''
    });
  }

  createAttributeInModel(model: Model) {
    model.attributes.push({
      name: '',
      value: ''
    });
  }

  uploadMainPhotoForModel(event: any, model: Model) {
    const file = event.target.files[0];
    this.uploadService.uploadModelMainPhoto(file)
      .subscribe(res => {
        if (res.url) {
          model.mainPhoto.url = res.url;
          model.mainPhoto.filePathFirebase = res.filePathFirebase;
        }
      });
  }

  createAttribute() {
    this.attributesService.createAttributes([this.newAttributeName]);
    this.newAttributeName = null;
  }

  createOrUpdateMark(mark: Mark) {
    const savedMarkId = this.marks.findIndex(m => m === mark);
    const savedMark = savedMarkId !== -1
      ? this.markWithKey.find((m, i) => i === savedMarkId)
      : null;

    if (savedMark) {
      this.marksService.updateMark(savedMark.key, mark)
        .subscribe(res => {
          console.log(res);
          alert('все найс');
        }, err => {
          console.log(err);
          alert('ошибка');
        });
    } else {
      this.marksService.createMark(mark)
        .subscribe(res => {
          console.log(res);
          alert('все найс');
        }, err => {
          console.log(err);
          alert('ошибка');
        });
    }
  }
}
