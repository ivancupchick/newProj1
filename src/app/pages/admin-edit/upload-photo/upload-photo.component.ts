import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { PhotoUrlFirebase } from 'src/app/services/urls.service';
import { UploadService } from 'src/app/services/upload.service';
import { HorizontalPosition, VerticalPosition } from 'src/app/services/marks.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.sass']
})
export class UploadPhotoComponent implements OnInit {
  @Input() folderName = 'shared';
  @Input() photo: PhotoUrlFirebase = null;

  private horizontalPosition: HorizontalPosition;
  @Input() set horisontal(value: HorizontalPosition) {
    this.horizontalPosition = value;

    this.setProperties();
  }

  private verticalPosition: VerticalPosition;
  @Input() set vertical(value: VerticalPosition) {
    this.verticalPosition = value;

    this.setProperties();
  }

  @ViewChild('image', { static: true }) imageRef: ElementRef;

  @Output() upload: EventEmitter<PhotoUrlFirebase> = new EventEmitter<PhotoUrlFirebase>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private uploadService: UploadService, private rootElem: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  setProperties() {
    if (this.horizontalPosition && this.verticalPosition && this.imageRef) {
      this.renderer.setStyle(
        this.imageRef.nativeElement,
        'object-position',
        `${this.horizontalPosition} ${this.verticalPosition}`
      );
      this.renderer.setStyle(
        this.imageRef.nativeElement,
        'object-fit',
        `cover`
      );

      this.renderer.setStyle(this.rootElem.nativeElement, 'width', `640px`);
      this.renderer.setStyle(this.rootElem.nativeElement, 'height', `200px`);
    }
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
