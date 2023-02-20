import { Component, Input, Output, EventEmitter, Renderer2, OnInit } from '@angular/core';

import { ContentChangeEvent, OpenApplicationAPI, OpenUploadAPI } from '../../core';

@Component({
  selector: 'berry-pdf-uploader',
  templateUrl: './pdfuploader.component.html',
  styleUrls: ['./pdfuploader.component.scss'],
})
export class PdfUploaderComponent implements OnInit {
  @Input() hash?: string;
  @Input() resourcetype = 'other';
  @Input() resourceid = 0;
  @Output() pdfChange: EventEmitter<ContentChangeEvent> = new EventEmitter();

  src = '';
  status = '';

  constructor(
    private renderer: Renderer2,
    private applicationAPI: OpenApplicationAPI,
    private uploadAPI: OpenUploadAPI,
  ) { }

  ngOnInit() {
    if (this.hash) {
      this.applicationAPI.getStorageServerPath().subscribe(
        serverPath => {
          this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash;
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
    this.src = '';
    this.uploadAPI.upload(this.resourcetype, this.resourceid, file).subscribe(data => {
      if (data.uploaded == 1 && data.fileName) {
        this.hash = data.fileName;
        this.applicationAPI.getStorageServerPath().subscribe(
          serverPath => {
            this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash;
          }
        );

        this.status = 'File uploaded successfully';

        this.pdfChange.emit({ hash: this.hash });
      }
    });
  }

  loaded() {
    this.renderer.setStyle(document.getElementsByClassName('ng2-pdf-viewer-container')[0], 'position', 'relative');
    this.renderer.setStyle(document.getElementsByClassName('ng2-pdf-viewer-container')[0], 'max-width', '100%');
  }

}
