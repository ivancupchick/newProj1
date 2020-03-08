import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export enum TypeAutoAttribute {
  select = 'select',
  text = 'text'
}

interface Attribute {
  name: string;
}

export interface AutoAttribute {
  name: string;
  type: TypeAutoAttribute;
  variants?: string[];
  isRequired: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AttributesService {
  private attributesRef: AngularFireObject<{ attributes: AutoAttribute[] }>;
  attributes: BehaviorSubject<AutoAttribute[]> = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {
    this.attributesRef = db.object('data');
    this.attributesRef.valueChanges()
      .subscribe(
        arg => this.attributes.next(arg ? (arg.attributes || []) : []),
        errors => console.log(errors)
      );
  }

  setAttributes(attributes: AutoAttribute[]) {
    attributes.forEach(attribute => {
      this.attributesRef
        .set({ attributes })
        .then(res => {
          console.log(res);
        });
    });
  }

  getAttributes(): Observable<AutoAttribute[]> {
    return this.attributes.asObservable();
  }
}
