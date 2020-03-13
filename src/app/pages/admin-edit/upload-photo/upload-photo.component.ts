import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PhotoUrlFirebase } from 'src/app/services/urls.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.sass']
})
export class UploadPhotoComponent implements OnInit {
  @Input() folderName = 'shared';
  @Input() photo: PhotoUrlFirebase = null;

  @Output() upload: EventEmitter<PhotoUrlFirebase> = new EventEmitter<PhotoUrlFirebase>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
  }

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    this.uploadService.uploadPhoto(file, `${this.folderName}/${file.name}`)
      .subscribe(res => {
        if (res.url) {
          this.upload.emit({
            url: res.url,
            filePathFirebase: res.filePathFirebase
          });
        }
      }, err => {
        console.log(err);
        this.upload.emit(null);
      });
  }

  choosePhoto(event) {
  }

  deletePhoto(event) {
    this.delete.emit(true);
  }

}
