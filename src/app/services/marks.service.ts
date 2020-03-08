import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import 'firebase/database';

export interface Attribute {
  name: string;
  value: string;
  variants?: any[]; // virtual
}

interface Comp {
  name: string;
  description: string;
}

interface PhotoUrlFirebase {
  url: string;
  filePathFirebase: string;
}

export interface Model {
  name: string;
  description: string;
  mainPhoto: PhotoUrlFirebase;
  photos: PhotoUrlFirebase[];
  comps: Comp[];
  attributes: Attribute[];
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
