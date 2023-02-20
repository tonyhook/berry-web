import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ContentChangeEvent, OpenApplicationAPI, OpenUploadAPI } from '../../core';

@Component({
  selector: 'berry-image-uploader',
  templateUrl: './imageuploader.component.html',
  styleUrls: ['./imageuploader.component.scss'],
})
export class ImageUploaderComponent implements OnInit {
  @Input() hash?: string;
  @Input() resourcetype = 'other';
  @Input() resourceid = 0;
  @Output() imageChange: EventEmitter<ContentChangeEvent> = new EventEmitter();

  src = '';
  status = '';

  constructor(
    private applicationAPI: OpenApplicationAPI,
    private uploadAPI: OpenUploadAPI,
  ) { }

  ngOnInit() {
    if (this.hash) {
      this.applicationAPI.getStorageServerPath().subscribe(
        serverPath => {
          this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash + '.thumbnail';
        }
      );
    }
  }

  fileChange(target: EventTarget | null) {
    const files: FileList | null = (<HTMLInputElement>target).files;

    if (files == null || files?.length == 0) {
      return;
    }

    const file: File | null = files.item(0);
    if (file == null) {
      return;
    }

    this.status = 'Uploading, please don\'t close the window';
    this.uploadAPI.upload(this.resourcetype, this.resourceid, file).subscribe(data => {
      if (data.uploaded == 1 && data.fileName) {
        this.hash = data.fileName;
        this.applicationAPI.getStorageServerPath().subscribe(
          serverPath => {
            this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash + '.thumbnail';
          }
        );

        this.status = 'File uploaded successfully';

        this.imageChange.emit({ hash: this.hash });
      }
    });
  }

}
