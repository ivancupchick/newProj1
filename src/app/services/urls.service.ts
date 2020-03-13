import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { DataService } from './data.service';
import { tap, map } from 'rxjs/operators';

export interface PhotoUrlFirebase {
  url: string;
  filePathFirebase: string;
}

interface Folders {
  [name: string]: PhotoUrlFirebase[]; // | Folders;
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

  addUrl(photo: PhotoUrlFirebase) {
    if (!photo || !photo.url || !photo.filePathFirebase) {
      return throwError('Url is empty');
    }

    const result = this.foldersSubj.getValue();
    const path = photo.filePathFirebase.split('/');

    // path.forEach((v, i) => {
    //   if (i === 0) {

    //   } else if (i < (path.length - 1)) {

    //   } else if (i === (path.length - 1)) {

    //   }
    // });

    if (!result[path[0]]) {
      result[path[0]] = [];
    }

    if (!result[path[0]].find(fn => fn.filePathFirebase === photo.filePathFirebase) && photo.url) {
      result[path[0]].push(photo);

      return this.dataService.setData(this.nameOfData, result)
        .pipe(
          tap(
            r => console.log(r),
            err => console.log(err)
          ),
          map(r => true)
        );
    } else {
      return of(true);
    }
  }

  // setUrls(urls: Folders) { // TODO!!! danger method
  //   if (!urls) {
  //     return throwError('Url is empty');
  //   }


  //   return this.dataService.setData(this.nameOfData, urls)
  //     .pipe(
  //       tap(
  //         r => console.log(r),
  //         err => console.log(err)
  //       )
  //     );
  // }

  /*
  it's for reset all urls
  setUrls() {
    const result = {};
    this.marks.forEach(m => {
      m.models.forEach(mm => {
        const addPhoto = (folderName: string, photo: PhotoUrlFirebase) => {
          if (photo && photo.url) {
            if (!result[folderName]) {
              result[folderName] = [];
            }

            result[folderName].push(photo);
          }
        };

        addPhoto('uploadModelMainPhoto', mm.mainPhoto);
        addPhoto('uploadModelMainPresentationPhoto', mm.mainPresenPhoto);

        if (mm.modulesInPres) {
          mm.modulesInPres.forEach(mmm => {
            if (mmm && mmm.data && (mmm.data as DesignModuleData).photos) {
              (mmm.data as DesignModuleData | GalleryModuleData).photos.forEach(p => {
                addPhoto('uploadModulePhotos', p);
              });
            }

            if (mmm && mmm.data && (mmm.data as EquipmentsModuleData).equipments) {
              (mmm.data as EquipmentsModuleData).equipments.forEach(e => {
                addPhoto('uploadModulePhotos', e.photo);
              });
            }
          });
        }
      });
    });

    this.urlsService.setUrls(result);
  }
  */

  getUrls(): Observable<Folders> {
    return this.foldersSubj.asObservable();
  }
}
