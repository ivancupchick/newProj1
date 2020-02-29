import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private storage: AngularFireStorage) { }

  uploadModelMainPhoto(file: File): Observable<{ loading: number, url: string, filePathFirebase: string }> {
    const filePath = `uploadModelMainPhoto/${file.name}`;
    const task = this.storage.upload(filePath, file);
    const fileRef = this.storage.ref(filePath);

    return new Observable(obs => {
      // observe percentage changes
      // this.uploadPercent = task.percentageChanges().subscribe;
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL()
              .subscribe(urlObj => {
                console.log(urlObj);
                obs.next({ loading: null, url: urlObj, filePathFirebase: filePath });
              });
          })
      ).subscribe();

      task.percentageChanges().subscribe(percentage => {
        obs.next({ loading: percentage, url: null, filePathFirebase: filePath });
      });
    //   task.snapshotChanges().subscribe(snap => {
    //     snap.downloadURL
    //   })
    //   task.downloadURL
    });
  }

  // uploadPercent: Observable<number>;
  // downloadURL: Observable<string>;
  // uploadModelMainPhoto(event) {
  //   const file = event.target.files[0];
  //   const filePath = 'name-your-file-path-here';
  //   const fileRef = this.storage.ref(filePath);
  //   const task = this.storage.upload(filePath, file);


  // }
}
