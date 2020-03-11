import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataService } from './data.service';

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
  nameOfData = 'attributes';
  attributes: BehaviorSubject<AutoAttribute[]> = new BehaviorSubject([]);

  constructor(private dataService: DataService) {
    dataService.getData(this.nameOfData)
      .subscribe(att => this.attributes.next(att ? att : []));
  }

  setAttributes(attributes: AutoAttribute[]) {
    this.dataService.setData(this.nameOfData, attributes)
      .subscribe(
        r => console.log(r),
        err => console.log(err)
      );
  }

  getAttributes(): Observable<AutoAttribute[]> {
    return this.attributes.asObservable();
  }
}
