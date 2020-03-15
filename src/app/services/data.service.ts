import { Injectable } from '@angular/core';
import { AngularFireObject, AngularFireDatabase } from '@angular/fire/database';
import 'firebase/database';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Data {
  [name: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataRef: AngularFireObject<Data>;
  dataBSubj: BehaviorSubject<Data> = new BehaviorSubject({});

  constructor(private db: AngularFireDatabase) {
    this.dataRef = db.object('data');
    this.dataRef.valueChanges()
      .subscribe(
        data => this.dataBSubj.next(data),
        errors => console.log(errors)
      );
  }

  setData(name: string, value: any) {
    const obj = this.dataBSubj.getValue();
    if (!obj) {
      return of(false);
    }

    obj[name] = value;

    return from(
      this.dataRef
        .set(obj)
      ).pipe(
        map(() => true)
      );
  }

  getData(name?: string): Observable<any> {
    return this.dataBSubj.asObservable()
      .pipe(
        map(result => name ? result[name] : result)
      );
  }
}
