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
  HorizontalPosition as HorizontalPosition,
  VerticalPosition,
  Comp,
  FuelEnum,
  TransmissionEnum,
  DrivetrainEnum,
  PresGalleryModule
} from 'src/app/services/marks.service';
import { AttributesService, AutoAttribute, TypeAutoAttribute } from 'src/app/services/attributes.service';
import { UploadService } from 'src/app/services/upload.service';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FileUrlFirebase, UrlsService } from 'src/app/services/urls.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.sass']
})
export class AdminEditComponent implements OnInit {
  DrivetrainEnum = DrivetrainEnum;
  drivetrainEnum = [{
    label: 'Выберите привод',
    value: null
  }, {
    label: 'Полный привод',
    value: DrivetrainEnum.AWD
  }, {
    label: 'Передний привод',
    value: DrivetrainEnum.FWD
  }, {
    label: 'Задний привод',
    value: DrivetrainEnum.RWD
  }];

  TransmissionEnum = TransmissionEnum;
  transmissionEnum = [{
    label: 'Выберите трансмиссию',
    value: null
  }, {
    label: 'Автомат',
    value: TransmissionEnum.automatic
  }, {
    label: 'Ручная',
    value: TransmissionEnum.manual
  }];

  FuelEnum = FuelEnum;
  fuelEnum = [{
    label: 'Выберите',
    value: null
  }, {
    label: 'Дизель',
    value: FuelEnum.diesel
  }, {
    label: 'Электро',
    value: FuelEnum.electric
  }, {
    label: 'Бензин',
    value: FuelEnum.petrol
  }];

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

  HorizontalPosition = HorizontalPosition;
  horizontalPosition = [{
    label: 'По центру',
    value: HorizontalPosition.center
  }, {
    label: 'Слева',
    value: HorizontalPosition.left
  }, {
    label: 'Справа',
    value: HorizontalPosition.right
  }];
  VerticalPosition = VerticalPosition;
  verticalPosition = [{
    label: 'По центру',
    value: VerticalPosition.center
  }, {
    label: 'Сверху',
    value: VerticalPosition.top
  }, {
    label: 'Снизу',
    value: VerticalPosition.bottom
  }];

  TypeAutoAttribute = TypeAutoAttribute;
  typeAutoAttribute = [{
    name: 'С вариантами',
    value: TypeAutoAttribute.select
  }, {
    name: 'Текст',
    value: TypeAutoAttribute.text
  }];

  markWithKey!: MarkWithKey[];
  marks!: Mark[];

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

  addEmptyEqupmentToModule(module: EquipmentsModuleData) {
    module.equipments.push({
      title: '',
      description: '',
      photo: {
        url: '',
        filePathFirebase: ''
      }
    });
  }

  deleteEquipmentFromModule(module: EquipmentsModuleData, equipment: EquipmentsData) {
    module.equipments = module.equipments.filter(me => me !== equipment);
  }

  isSelectableAttribute(attribute: Attribute) {
    const attributeObj = this.attributes.find(a => a.name === attribute.name);

    return attributeObj ? attributeObj.type === TypeAutoAttribute.select : false;
  }

  addVariantToAttribute(attribute: Attribute) {
    const attributeObj = this.attributes.find(a => a.name === attribute.name);

    attribute.variants = [{label: 'Выберите значение', value: ''}, ...( attributeObj?.variants ? attributeObj.variants.map(v => ({ label: v, value: v })) : [])];
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
      presPhotoHorizontalPosition: HorizontalPosition.center,
      presPhotoVerticalPosition: VerticalPosition.center,
      mainPresenPhoto: {
        url: '',
        filePathFirebase: ''
      },
      comps: [],
      attributes,
      modulesInPres: [],
      priseList: {
        url: '',
        filePathFirebase: ''
      }
    });
  }

  addCompToModel(model: Model) {
    if (!model.comps) {
      model.comps = [];
    }

    model.comps.push({
      name: '',
      fuel: FuelEnum.diesel, // enum
      engine: '',
      hp: '',
      transmission: TransmissionEnum.automatic, // enum
      drivetrain: DrivetrainEnum.AWD, // enum
      prise: ''
    });
  }

  deleteCompFromModule(model: Model, comp: Comp) {
    model.comps = model.comps.filter(c => c !== comp);
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
    let moduleData;

    switch (type) {
      case PresModuleType.design:
        moduleData = {
          type,
          data: {
            title: '',
            subTitle: '',
            descriptionTitle: '',
            descriptionText: '',
            photos: []
          }
        };
        break;
      case PresModuleType.gallery:
        moduleData = {
          type,
          data: {
            title: '',
            subTitle: '',
            photos: []
          }
        };
        break;
      case PresModuleType.equipment:
        moduleData = {
          type,
          data: {
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
          }
        };
        break;
    }

    if (!model.modulesInPres) {
      model.modulesInPres = [];
    }

    if (moduleData) {
      model.modulesInPres.push(moduleData);
    }
  }

  addNullToArray(data: any[] | null): any[] {
    if (!data) {
      data = [];
    }
    return [null, ...data];
  }

  deletePhotosFormDesignModule(presModule: PresDesignModule | PresGalleryModule, photo: FileUrlFirebase) {
    presModule.data.photos = presModule.data.photos.filter(p => p !== photo);
  }

  uploadPhotoToGalleryOrDesignModule(event: Event | null, modulee: PresDesignModule | PresGalleryModule) {
    if (!event) {
      return;
    }
    const file = (event.target as any).files[0];
    (event.target as any).value = null;
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

  uploadMainPhotoForModel(photo: FileUrlFirebase | null, model: Model) {
    if (!photo) {
      return;
    }

    if (!model.mainPhoto) {
      model.mainPhoto = {} as FileUrlFirebase;
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

  uploadMainPresenPhotoForModel(photo: FileUrlFirebase | null, model: Model) {
    if (!photo) {
      return;
    }

    if (!model.mainPresenPhoto) {
      model.mainPresenPhoto = {} as FileUrlFirebase;
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

  uploadPhotoToEquipmentModule(event: Event, equipment: EquipmentsData) {
    const file = (event.target as any).files[0];
    (event.target as any).value = null;
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







  /*

  Prise list

  */
  checkPriseList(urlFire: FileUrlFirebase) {
    window.open(urlFire.url, '_blank');
  }

  uploadPriseList(event: any, model: Model) {
    const folderName = 'uploadModelPriseList';
    const file = event.target.files[0];
    this.uploadService.uploadPhoto(file, `${folderName}/${file.name}`)
      .subscribe(res => {
        if (res.url) {
          model.priseList = {
            url: res.url,
            filePathFirebase: res.filePathFirebase
          };
        }
      }, err => {
        console.log(err);
      });
  }

  deletePriseList(model: Model) {
    model.priseList = {
      url: '',
      filePathFirebase: ''
    };
  }
}
