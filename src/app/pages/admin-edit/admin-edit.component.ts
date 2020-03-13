import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  Mark,
  Model,
  MarksService,
  MarkWithKey,
  Attribute,
  PresModuleType,
  PresModule,
  PresDesignModule,
  DesignModuleData,
  GalleryModuleData,
  EquipmentsModuleData,
  EquipmentsData,
  PresEquipmentsModule,
  MainPhotoPosition
} from 'src/app/services/marks.service';
import { AttributesService, AutoAttribute, TypeAutoAttribute } from 'src/app/services/attributes.service';
import { UploadService } from 'src/app/services/upload.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { PhotoUrlFirebase, UrlsService } from 'src/app/services/urls.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.sass']
})
export class AdminEditComponent implements OnInit {
  PresModuleType = PresModuleType;
  presModuleType = [{
    label: 'Выберите значение',
    value: ''
  }, {
    label: 'Дизайн',
    value: PresModuleType.design
  }, {
    label: 'Галлерея',
    value: PresModuleType.gallery
  }, {
    label: 'Оборудование',
    value: PresModuleType.equipment
  }];

  MainPhotoPosition = MainPhotoPosition;
  mainPhotoPosition = [{
    label: 'центр',
    value: MainPhotoPosition.center
  }, {
    label: '<-',
    value: MainPhotoPosition.left
  }, {
    label: '->',
    value: MainPhotoPosition.right
  }];

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
    private cd: ChangeDetectorRef,
    private urlsService: UrlsService
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

    if (!mark.models) {
      mark.models = [];
    }

    mark.models.push({
      name: '',
      description: '',
      mainPhoto: {
        url: '',
        filePathFirebase: ''
      },
      mainPhotoPosition: MainPhotoPosition.center,
      mainPresenPhoto: {
        url: '',
        filePathFirebase: ''
      },
      comps: [],
      attributes,
      modulesInPres: []
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

  getModuleType(type: PresModuleType) {
    switch (type) {
      case PresModuleType.design: return 'Дизайн';
      case PresModuleType.gallery: return 'Галлерея';
      case PresModuleType.equipment: return 'Оборудование';
    }
  }

  addModuleToModelPres(model: Model, formData: NgForm) {
    const type = formData.value.type;
    formData.setValue({ type: '' });
    const moduleData: PresModule = {
      type,
      data: null
    };
    switch (moduleData.type) {
      case PresModuleType.design:
        moduleData.data = {
          title: '',
          subTitle: '',
          descriptionTitle: '',
          descriptionText: '',
          photos: []
        };
        break;
      case PresModuleType.gallery:
        moduleData.data = {
          title: '',
          subTitle: '',
          photos: []
        };
        break;
      case PresModuleType.equipment:
        moduleData.data = {
          title: '',
          subTitle: '',
          subSubTitle: '',
          equipments: [{
            title: '',
            description: '',
            photo: {
              url: '',
              filePathFirebase: ''
            }
          }, {
            title: '',
            description: '',
            photo: {
              url: '',
              filePathFirebase: ''
            }
          }]
        };
        break;
    }

    if (!model.modulesInPres) {
      model.modulesInPres = [];
    }

    model.modulesInPres.push(moduleData);
  }

  addNullToArray(data: any[] | null): any[] {
    if (!data) {
      data = [];
    }
    return [null, ...data];
  }

  deletePhotosFormDesignModule(presModule: PresDesignModule, photo: PhotoUrlFirebase) {
    presModule.data.photos = presModule.data.photos.filter(p => p !== photo);
  }

  uploadPhotoToGalleryOrDesignModule(event: DragEvent, modulee: PresDesignModule) {
    const file = (event.target as HTMLInputElement).files[0];
    (event.target as HTMLInputElement).value = null;
    this.uploadService.uploadPhoto(file, `uploadModulePhotos/${file.name}`)
      .subscribe(res => {
        if (res.url) {
          if (!modulee.data.photos) {
            modulee.data.photos = [];
          }

          modulee.data.photos.push({
            url: res.url,
            filePathFirebase: res.filePathFirebase
          });
        }
      });
  }

  uploadMainPhotoForModel(photo: PhotoUrlFirebase, model: Model) {
    if (!photo) {
      return;
    }

    if (!model.mainPhoto) {
      model.mainPhoto = {} as PhotoUrlFirebase;
    }
    model.mainPhoto = Object.assign({}, photo);
  }

  deletePhotoFromModel(e: boolean, model: Model) {
    if (e) {
      model.mainPhoto = {
        url: '',
        filePathFirebase: ''
      };
    }
  }

  uploadMainPresenPhotoForModel(photo: PhotoUrlFirebase, model: Model) {
    if (!photo) {
      return;
    }

    if (!model.mainPresenPhoto) {
      model.mainPresenPhoto = {} as PhotoUrlFirebase;
    }

    model.mainPresenPhoto = Object.assign({}, photo);
  }

  deleteMainPresenPhotoForModel(e: boolean, model: Model) {
    if (e) {
      model.mainPresenPhoto = {
        url: '',
        filePathFirebase: ''
      };
    }
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

  // for Typing template
  getMarkType(mark: Mark): Mark {
    return mark as Mark;
  }

  getDesingDataType(data: DesignModuleData | GalleryModuleData | EquipmentsModuleData): DesignModuleData { // TODO replace to pipe
    return data as DesignModuleData;
  }

  getGalleryDataType(data: DesignModuleData | GalleryModuleData | EquipmentsModuleData): GalleryModuleData { // TODO replace to pipe
    return data as GalleryModuleData;
  }

  getEquipmentsDataType(data: DesignModuleData | GalleryModuleData | EquipmentsModuleData): EquipmentsModuleData { // TODO replace to pipe
    if (!(data as EquipmentsModuleData).equipments) {
      (data as EquipmentsModuleData).equipments = [];
    }
    return data as EquipmentsModuleData;
  }

  getEquipmentType(data: EquipmentsData): EquipmentsData { // TODO replace to pipe, or not?
    return data as EquipmentsData;
  }

  uploadPhotoToEquipmentModule(event: DragEvent, equipment: EquipmentsData) {
    const file = (event.target as HTMLInputElement).files[0];
    (event.target as HTMLInputElement).value = null;
    this.uploadService.uploadPhoto(file, `uploadModulePhotos/${file.name}`)
      .subscribe(res => {
        if (res.url) {
          equipment.photo = {
            url: res.url,
            filePathFirebase: res.filePathFirebase
          };
        }
      });
  }
}
