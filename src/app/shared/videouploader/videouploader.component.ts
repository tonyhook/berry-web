import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Observable, concat } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ContentChangeEvent, OpenApplicationAPI, OpenUploadAPI, Upload } from '../../core';

@Component({
  selector: 'berry-video-uploader',
  templateUrl: './videouploader.component.html',
  styleUrls: ['./videouploader.component.scss'],
})
export class VideoUploaderComponent implements OnInit {
  @Input() hash?: string;
  @Input() resourcetype = 'other';
  @Input() resourceid = 0
  @ViewChild('video') video: ElementRef | undefined;
  @ViewChild('source') source: ElementRef | undefined;
  @ViewChild('file') file: ElementRef | undefined;
  @Output() videoChange: EventEmitter<ContentChangeEvent> = new EventEmitter();

  src = '';
  status = '';

  constructor(
    private applicationAPI: OpenApplicationAPI,
    private uploadAPI: OpenUploadAPI,
  ) { }

  ngOnInit() {
    if (this.hash != null) {
      this.applicationAPI.getStorageServerPath().subscribe(
        serverPath => {
          this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash;
        }
      );
    } else {
      this.src = '';
    }
  }

  choosefile(event: MouseEvent) {
    if (this.file) {
      this.file.nativeElement.click();
    }

    event.preventDefault();
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
    const group = uuidv4();
    if (file.size > 4 * 1024 * 1024) {
      const total = Math.floor((file.size + 4 * 1024 * 1024) / (4 * 1024 * 1024));
      let successful = 0;
      const fragment: File[] = new Array<File>(total);
      const call: Observable<Upload>[] = new Array<Observable<Upload>>(total);

      for (let i = 0; i < total; i++) {
        const start = i * 4 * 1024 * 1024;
        let end = (i + 1) * 4 * 1024 * 1024;
        if (end > file.size) {
          end = file.size;
        }

        const blob: Blob = file.slice(start, end, file.type);

        fragment[i] = new File([blob], file.name, {type: file.type});
        call[i] = this.uploadAPI.uploadEx(this.resourcetype, this.resourceid, group, total, i, fragment[i]);
      }

      this.status = 'Uploading ' + (successful + 1) + '/' + total + ' fragment, please don\'t close the window';

      concat(...call).subscribe(data => {
        if (data.uploaded == 1 && data.fileName) {
          this.hash = data.fileName;
          this.applicationAPI.getStorageServerPath().subscribe(
            serverPath => {
              this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash;

              if (this.source) {
                this.source.nativeElement.setAttribute('src', this.src);
              }
              if (this.video) {
                this.video.nativeElement.load();
              }

              this.status = 'File uploaded successfully';

              if (this.hash) {
                this.videoChange.emit({ hash: this.hash });
              }
            }
          );

        }
        if (data.uploaded == 2) {
          successful++;
          this.status = 'Uploading ' + (successful + 1) + '/' + total + ' fragment, please don\'t close the window';
        }
      });
    } else {
      this.uploadAPI.upload(this.resourcetype, this.resourceid, file).subscribe(data => {
        if (data.uploaded == 1 && data.fileName) {
          this.hash = data.fileName;
          this.applicationAPI.getStorageServerPath().subscribe(
            serverPath => {
              this.src = serverPath + this.resourcetype + '/' + this.resourceid + '/' + this.hash;

              if (this.source) {
                this.source.nativeElement.setAttribute('src', this.src);
              }
              if (this.video) {
                this.video.nativeElement.load();
              }

              this.status = 'File uploaded successfully';

              if (this.hash) {
                this.videoChange.emit({ hash: this.hash });
              }
            }
          );
        }
      });
    }
  }

}
