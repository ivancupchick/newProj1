import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {
  private attributesRef: AngularFireList<string>;
  attributes: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    this.attributesRef = db.list('attributes');
    this.attributesRef.valueChanges()
      .subscribe(
        arg => this.attributes.next(arg || []),
        errors => console.log(errors)
      );
  }

  createAttributes(attributes: string[]) {
    attributes.forEach(attribute => {
      this.attributesRef
        .push(attribute)
        .then(res => {
          console.log(res);
        });
    });
  }

  getAttributes(): Observable<string[]> {
    return this.attributes.asObservable();
  }
}
