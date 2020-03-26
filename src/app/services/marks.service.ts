import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import 'firebase/database';
import { map } from 'rxjs/operators';
import { FileUrlFirebase } from './urls.service';

export interface Attribute {
  name: string;
  value: string;
  variants?: any[]; // virtual
  isRequired?: boolean;
}

export interface Comp { // TODO!
  name: string;
  fuel: FuelEnum; // enum
  engine: string;
  hp: string;
  transmission: TransmissionEnum; // enum
  drivetrain: DrivetrainEnum; // enum
  prise: string;
}

// 1. Тип мотора (выбор бензин, дизель, Электро)
// 2. Объём мотора, л. ( прописывается)
// 3. Лошадиные силы, л.с. (Прописывается)
// 4. Тип коробки передач ( выбор механика, автомат)
// 5. Привод ( выбор полный, передний, задний)
// 6. Комплектация (прописывается)
// 7. Стоимость ( прописывается) - пишется в евро, а в соседнем окне подтягивается в бел рублях по курсу нбрб(с округлением до 100*)

export enum FuelEnum {
  diesel = 'diesel',
  petrol = 'petrol',
  electric = 'electric'
}

export enum TransmissionEnum {
  automatic = 'automatic',
  manual = 'manual'
}

export enum DrivetrainEnum {
  AWD = 'AWD', // полный
  FWD = 'FWD',
  RWD = 'RWD'
}

export interface DesignModuleData {
  title: string;
  subTitle: string;
  descriptionTitle: string;
  descriptionText: string;
  photos: FileUrlFirebase[];
}

export interface GalleryModuleData {
  title: string;
  subTitle: string;
  photos: FileUrlFirebase[];
}

export interface EquipmentsData {
  title: string;
  description: string;
  photo: FileUrlFirebase;
}

export interface EquipmentsModuleData { //
  title: string;
  subTitle: string;
  subSubTitle: string;
  equipments: EquipmentsData[];
}

export enum PresModuleType {
  design = 'design',
  gallery = 'gallery',
  equipment = 'equipment'
}

export enum HorizontalPosition {
  center = 'center',
  right = 'right',
  left = 'left'
}

export enum VerticalPosition {
  center = 'center',
  top = 'top',
  bottom = 'bottom'
}

export interface PresDesignModule {
  type: PresModuleType.design;
  data: DesignModuleData;
}

export interface PresGalleryModule {
  type: PresModuleType.gallery;
  data: GalleryModuleData;
}

export interface PresEquipmentsModule {
  type: PresModuleType.equipment;
  data: EquipmentsModuleData;
}

export type PresModule = PresDesignModule |
                         PresGalleryModule |
                         PresEquipmentsModule;

export interface Model {
  name: string;
  description: string;
  presPhotoHorizontalPosition: HorizontalPosition;
  presPhotoVerticalPosition: VerticalPosition;
  mainPhoto: FileUrlFirebase;
  mainPresenPhoto: FileUrlFirebase;
  comps: Comp[];
  attributes: Attribute[];
  modulesInPres: PresModule[];
  priseList: FileUrlFirebase;
}

export interface Mark {
  name: string;
  description: string;
  models: Model[];
}

export interface MarkWithKey {
  mark: Mark;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private marksRef: AngularFireList<Mark>;
  marks: BehaviorSubject<Mark[]> = new BehaviorSubject([]);
  marksWithKeys: BehaviorSubject<MarkWithKey[]> = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    this.marksRef = db.list('marks');
    // this.marksRef.valueChanges()
    //   .subscribe(
    //     arg => this.marks.next(arg || []),
    //     errors => console.log(errors)
    //   );

    this.marksRef.snapshotChanges()
      .pipe(
        map(m => {
          m.forEach(mm => {
            mm.payload.val().models.forEach(mmm => {
              if ((mmm as any).mainPhotoPosition) {
                mmm.presPhotoHorizontalPosition = (mmm as any).mainPhotoPosition;
                delete (mmm as any).mainPhotoPosition;
              }

              mmm.presPhotoHorizontalPosition = mmm.presPhotoHorizontalPosition || HorizontalPosition.center;
              mmm.presPhotoVerticalPosition = mmm.presPhotoVerticalPosition || VerticalPosition.center;

              if (!mmm.priseList) {
                mmm.priseList = { url: '', filePathFirebase: '' };
              }
            });
          });
          return m;
        })
      )
      .subscribe(changes => {
        const value: MarkWithKey[] = !changes
          ? []
          : changes.map(c => ({ mark: c.payload.val(), key: c.payload.key }));

        this.marksWithKeys.next(value);

        this.marks.next(value.map(m => m.mark));
      }
      );
  }

  getMarks(): Observable<MarkWithKey[]> {
    return this.marksWithKeys.asObservable();
  }

  createMark(mark: Mark): Observable<any> {
    return new Observable(obs => {
      this.marksRef.push(mark)
        .then(res => {
          obs.next(res);
        });
    });
  }

  updateMark(key: string, mark: Mark): Observable<any> {
    return new Observable(obs => {
      this.marksRef.update(key, mark)
        .then(res => {
          obs.next(res);
        });
    });
  }
}
