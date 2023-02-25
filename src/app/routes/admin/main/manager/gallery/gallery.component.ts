import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Gallery, GalleryAPI, ContentChangeEvent, PaginatedDataSource, Sort, Page, OpenApplicationAPI, Picture, PictureAPI, OpenUploadAPI, Topic, TopicAPI, TagAPI, Tag } from '../../../../../core';
import { SimpleDialogComponent } from 'src/app/shared/simpledialog/simpledialog.component';

@Component({
  selector: 'berry-gallery-manager',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryManagerComponent implements OnInit {
  type = '';
  serverPath = '';
  gallery: Gallery | null = null;
  galleries: Gallery[] = [];
  pictures: Picture[] = [];
  topics: Topic[] = [];
  tags: Tag[] = [];
  page?: Page<Gallery>;
  initialSort: Sort<Gallery> = {property: 'updateTime', order: 'desc'};

  showNewForm = false;
  formGroup: FormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
    'topic': ['No Topic', null],
    'tags': [[], null],
    'disabled': [false, null],
  });
  formGroupNew: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'topic': ['No Topic', null],
    'tags': [[], null],
    'disabled': [true, null],
  });

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<Gallery, null>(
    (request) => this.galleryAPI.getGalleryList(this.type, request),
    {property: 'updateTime', order: 'desc'},
    null,
    25
  );

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private galleryAPI: GalleryAPI,
    private pictureAPI: PictureAPI,
    private topicAPI: TopicAPI,
    private tagAPI: TagAPI,
    private applicationAPI: OpenApplicationAPI,
    private uploadAPI: OpenUploadAPI,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['type'] != null) {
        if (this.type != params['type']) {
          this.type = params['type'];
          this.galleries = [];
          this.data = new PaginatedDataSource<Gallery, null>(
            (request) => this.galleryAPI.getGalleryList(this.type, request),
            {property: 'updateTime', order: 'desc'},
            null,
            25
          );

          this.data.page$.subscribe(data => {
            if (data.content.length == 0 && data.totalElements != 0) {
              this.data.fetch(data.number - 1);
            } else {
              this.page = data;
              this.galleries = data.content;
            }
          });

          this.topicAPI.getTopicList(this.type, {
            page: 0, size: 1048576, sort: {property: 'updateTime', order: 'desc'}
          }).subscribe(data => {
            this.topics = data.content;
          });
          this.tagAPI.getTagList(this.type, {
            page: 0, size: 1048576, sort: {property: 'updateTime', order: 'desc'}
          }).subscribe(data => {
            this.tags = data.content;
          });

          this.gallery = null;
        }
      }
    });
    this.applicationAPI.getStorageServerPath().subscribe(serverPath => {
      this.serverPath = serverPath;
    });
  }

  pageChange(event: PageEvent) {
    this.data.fetch(event.pageIndex);
  }

  selectGallery(gallery: Gallery) {
    if (gallery && gallery.id) {
      this.gallery = gallery;

      const tags: string[] = [];
      if (this.gallery.tags) {
        for (const tag of this.gallery.tags) {
          tags.push(tag.name);
        }
      }

      this.formGroup = this.formBuilder.group({
        'name': [this.gallery.name, null],
        'topic': [this.gallery.topic ? this.gallery.topic.name : 'No Topic', null],
        'tags': [tags, null],
        'disabled': [this.gallery.disabled, null],
      });

      this.pictureAPI.getPictureList(gallery.id).subscribe(data => {
        this.pictures = data;
      });
    }
  }

  quitGallery() {
    this.gallery = null;
  }

  newGallery() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const tags: Tag[] = [];
    for (const tagName of this.formGroupNew.value.tags) {
      const tag = this.tags.find(tag => tag.name === tagName);
      if (tag) {
        tags.push(tag);
      }
    }

    const gallery: Gallery = {
      id: null,
      type: this.type,
      name: this.formGroupNew.value.name,
      topic: this.topics.find(topic => topic.name === this.formGroupNew.value.topic),
      tags: tags,
      disabled: this.formGroupNew.value.disabled,
    };
    this.galleryAPI.addGallery(gallery).subscribe(() => {
      if (this.page) {
        this.data.fetch(this.page.number);
      }
    });

    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
      'topic': ['No Topic', null],
      'tags': [[], null],
      'disabled': [true, null],
    });
    this.showNewForm = false;
  }

  updateGallery() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    const tags: Tag[] = [];
    for (const tagName of this.formGroup.value.tags) {
      const tag = this.tags.find(tag => tag.name === tagName);
      if (tag) {
        tags.push(tag);
      }
    }

    if (this.gallery && this.gallery.id) {
      this.gallery.name = this.formGroup.value.name;
      this.gallery.topic = this.topics.find(topic => topic.name === this.formGroup.value.topic);
      this.gallery.tags = tags;
      this.gallery.disabled = this.formGroup.value.disabled;

      this.galleryAPI.updateGallery(this.gallery.id, this.gallery).subscribe(() => {
        this.gallery = null;
      });
    }
  }

  deleteGallery() {
    if (this.gallery && this.gallery.id) {
      this.galleryAPI.removeGallery(this.gallery.id).subscribe(() => {
        this.gallery = null;
        if (this.page) {
          this.data.fetch(this.page.number);
        }
      });
    }
  }

  changeGallery(event: ContentChangeEvent) {
    if (this.gallery && this.gallery.id) {
      this.gallery.image = event.hash;
      this.galleryAPI.updateGallery(this.gallery.id, this.gallery).subscribe();
    }
  }

  addPicture(target: EventTarget | null) {
    const files: FileList | null = (<HTMLInputElement>target).files;

    if (files == null || files?.length == 0) {
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file: File | null = files.item(i);
      if (file == null) {
        continue;
      }

      if (this.gallery) {
        this.pictureAPI.addPicture({
          name: '',
          image: '',
          gallery: this.gallery,
          sequence: 0,
          disabled: false,
        }).subscribe(picture => {
          if (picture.id) {
            this.uploadAPI.upload('picture', picture.id, file).subscribe(file => {
              if (file.uploaded == 1 && file.fileName) {
                picture.image = file.fileName;
                if (picture.id) {
                  this.pictureAPI.updatePicture(picture.id, picture).subscribe(() => {
                    if (this.gallery && this.gallery.id) {
                      this.pictureAPI.getPictureList(this.gallery.id).subscribe(data => {
                        this.pictures = data;
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    }

    (<HTMLInputElement>target).value = '';
  }

  removePicture(picture: Picture) {
    if (picture.id) {
      this.pictureAPI.removePicture(picture.id).subscribe(() => {
        if (this.gallery && this.gallery.id) {
          this.pictureAPI.getPictureList(this.gallery.id).subscribe(data => {
            this.pictures = data;
          });
        }
      });
    }
  }

  addTopic(): void {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {property: 'topic', name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        this.topicAPI.addTopic({
          type: this.type,
          name: result,
          disabled: false,
        }).subscribe(() => {
          this.topicAPI.getTopicList(this.type, {
            page: 0, size: 1048576, sort: {property: 'updateTime', order: 'desc'}
          }).subscribe(data => {
            this.topics = data.content;
          });
        });
      }
    });
  }

  addTag(): void {
    const dialogRef = this.dialog.open(SimpleDialogComponent, {
      data: {property: 'tag', name: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.length > 0) {
        this.tagAPI.addTag({
          type: this.type,
          name: result,
          disabled: false,
        }).subscribe(() => {
          this.tagAPI.getTagList(this.type, {
            page: 0, size: 1048576, sort: {property: 'updateTime', order: 'desc'}
          }).subscribe(data => {
            this.tags = data.content;
          });
        });
      }
    });
  }

}
