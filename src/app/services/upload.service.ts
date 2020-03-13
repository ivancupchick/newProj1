import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UrlsService } from './urls.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private storage: AngularFireStorage, private urlsService: UrlsService) { }

  uploadPhoto(file: File, filePath: string): Observable<{ loading: number, url: string, filePathFirebase: string }> {
    const task = this.storage.upload(filePath, file);
    const fileRef = this.storage.ref(filePath);

    return new Observable(obs => {
      task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL()
              .subscribe(urlObj => {
                this.urlsService.addUrl({ url: urlObj, filePathFirebase: filePath })
                  .subscribe(
                    () => {
                      obs.next({ loading: null, url: urlObj, filePathFirebase: filePath });
                    },
                    err => obs.error(err));
              });
          })
      ).subscribe();

      task.percentageChanges().subscribe(percentage => {
        obs.next({ loading: percentage, url: null, filePathFirebase: filePath });
      });
    });
  }
}
