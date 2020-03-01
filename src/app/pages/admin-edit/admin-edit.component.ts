import { Component, OnInit } from '@angular/core';
import { Mark, Model, MarksService } from 'src/app/services/marks.service';
import { AttributesService } from 'src/app/services/attributes.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.sass']
})
export class AdminEditComponent implements OnInit {
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
    this.attributesService.getAttributes().subscribe(attributes => {
      this.attributes = [...attributes];
    });
  }

  createModel() {
    this.newMark.models.push({
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

  createMark() {
    this.marksService.createMark(this.newMark)
      .subscribe(res => {
        console.log(res);
        alert('все найс');
      }, err => {
        console.log(err);
        alert('ошибка');
      });
  }
}
