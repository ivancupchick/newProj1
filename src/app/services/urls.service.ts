import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { DataService } from './data.service';
import { tap } from 'rxjs/operators';

interface Folders {
  [name: string]: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  nameOfData = 'urls';
  foldersSubj: BehaviorSubject<Folders> = new BehaviorSubject({});

  constructor(private dataService: DataService) {
    dataService.getData(this.nameOfData)
      .subscribe(att => this.foldersSubj.next(att ? att : []));
  }

  addUrl(folderName: string, url: string, fileName) {
    if (!url) {
      return throwError('Url is empty');
    }

    const result = this.foldersSubj.getValue();
    if (!result[folderName]) {
      result[folderName] = [];
    }

    if (!result[folderName].find(fn => fn === folderName) && url) {
      result[folderName].push(url);
      return this.dataService.setData(this.nameOfData, result)
        .pipe(
          tap(
            r => console.log(r),
            err => console.log(err)
          )
        );
    }

    return of<void>();
  }

  getUrls(): Observable<Folders> {
    return this.foldersSubj.asObservable();
  }
}
