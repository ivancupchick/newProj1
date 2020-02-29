import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import 'firebase/database';

interface Attribute {
  name: string;
  value: string;
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

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private marksRef: AngularFireList<Mark>;
  marks: BehaviorSubject<Mark[]> = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    this.marksRef = db.list('marks');
    this.marksRef.valueChanges()
      .subscribe(
        arg => this.marks.next(arg || []),
        errors => console.log(errors)
      );
  }

  getMarks(): Observable<Mark[]> {
    return this.marks.asObservable();
  }

  createMark(mark: Mark): Observable<any> {
    return new Observable(obs => {
      this.marksRef.push(mark)
        .then(res => {
          obs.next(res);
        });
    });
  }
}
