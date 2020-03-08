import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Mark, Model, MarksService, MarkWithKey, Attribute } from 'src/app/services/marks.service';
import { AttributesService, AutoAttribute, TypeAutoAttribute } from 'src/app/services/attributes.service';
import { UploadService } from 'src/app/services/upload.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.sass']
})
export class AdminEditComponent implements OnInit {
  TypeAutoAttribute = TypeAutoAttribute;
  typeAutoAttribute = [{
    name: 'С вариантами',
    value: TypeAutoAttribute.select
  }, {
    name: 'Текст',
    value: TypeAutoAttribute.text
  }];

  markWithKey: MarkWithKey[];
  marks: Mark[];

  isShowCreateMarkForm = false;

  newMark: Mark = {
    name: '',
    description: '',
    models: []
  };

  attributes: AutoAttribute[] = [];
  savedAttributes: AutoAttribute[] = [];
  attributesNames: string[] = [];

  constructor(
    private attributesService: AttributesService,
    private uploadService: UploadService,
    private marksService: MarksService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.marksService.getMarks().subscribe(m => {
      this.markWithKey = m;
      this.marks = m.map(mm => mm.mark);
    });

    this.attributesService.getAttributes().subscribe(attributes => {
      this.savedAttributes = [...attributes];
      this.attributes = [...attributes];
      this.attributesNames = attributes.map(a => a.name);
    });
  }

  isSelectableAttribute(attribute: Attribute) {
    const attributeObj = this.attributes.find(a => a.name === attribute.name);

    return attributeObj ? attributeObj.type === TypeAutoAttribute.select : false;
  }

  addVariantToAttribute(attribute: Attribute) {
    const attributeObj = this.attributes.find(a => a.name === attribute.name);

    attribute.variants = [{label: 'Выберите значение', value: ''}, ...attributeObj.variants
      .map(v => ({ label: v, value: v }))];
  }

  createModel(mark: Mark) {
    const attributes = this.savedAttributes
      .map(sa => ({ name: sa.name, value: '', isRequired: sa.isRequired }));

    mark.models.push({
      name: '',
      description: '',
      mainPhoto: {
        url: '',
        filePathFirebase: ''
      },
      photos: [],
      comps: [],
      attributes
    });
  }

  createComp(model: Model) {
    model.comps.push({
      name: '',
      description: ''
    });
  }

  createAttributeInModel(model: Model) {
    if (!model.attributes) {
      model.attributes = [];
    }

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

  createAttributes() {
    this.attributesService.setAttributes(this.attributes);
  }

  addAttribte() {
    this.attributes.push({
      name: '',
      type: TypeAutoAttribute.text,
      isRequired: false
    });
  }

  deleteAttributeFromModel(model: Model, attribute: Attribute) {
    model.attributes = model.attributes.filter((ma, i) => ma !== attribute);
  }

  refresfAttributes() {
    this.attributesService.getAttributes().pipe(take(1)).subscribe(attributes => {
      this.attributes = [...attributes];
    });
  }

  deleteAttribute(attr: AutoAttribute) {
    this.attributes = this.attributes.filter(a => a !== attr);
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

  deleteModelFromMark(mark: Mark, model: Model) {
    mark.models = mark.models.filter(m => m !== model);
  }
}
