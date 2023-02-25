import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { combineLatest } from 'rxjs';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';

import { environment } from '../../../../../../environments/environment';

import { Column, ColumnAPI, Content, ContentAPI, ContentChangeEvent, ContentService, OpenApplicationAPI, OpenUploadAPI } from '../../../../../core';
import { ItemSelectEvent } from 'src/app/shared/treeview/treeview.component';

@Component({
  selector: 'berry-content-manager',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0'})),
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ContentManagerComponent implements OnInit {
  contents: Content[] = [];
  content: Content | null = null;
  columns: Column[] = [];
  column: Column | null = null;

  readyToShowEditor = false;
  editorContent = '';
  editorConfig = {
    allowedContent: true,
    pasteFilter: null,
    extraPlugins: 'uploadimage',
    uploadUrl: '',
  };

  @ViewChild('table') table?: MatTable<Content>;
  displayedColumns: string[] = ['type', 'title'];
  showNewForm = false;
  formGroup: UntypedFormGroup = this.formBuilder.group({
    'type': ['article', Validators.required],
    'title': ['title', Validators.required],
    'subtitle': ['subtitle', null],
    'description': ['description', null],
    'disabled': [false, null],
  });
  formGroupNew: UntypedFormGroup = this.formBuilder.group({
    'type': ['article', Validators.required],
    'title': ['', Validators.required],
    'subtitle': ['', null],
    'description': ['', null],
    'disabled': [true, null],
  });
  formGroupLink: UntypedFormGroup = this.formBuilder.group({
    'link': ['', Validators.required],
  });

  constructor(
    private formBuilder: UntypedFormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private contentService: ContentService,
    private contentAPI: ContentAPI,
    private columnAPI: ColumnAPI,
    private applicationAPI: OpenApplicationAPI,
    private uploadAPI: OpenUploadAPI,
  ) { }

  ngOnInit() {
    combineLatest([
      this.route.params,
      this.route.queryParams,
    ]).subscribe(results => {
      if (results[0]['id'] == null) {
        this.columnAPI.getColumnList().subscribe(data => {
          this.columns = data;
          this.setCurrentColumn(+results[1]['columnId']);
        });
      }
      if (results[0]['id'] != null) {
        this.setCurrentContent(+results[0]['id']);
      }
    });
  }

  getContentList() {
    if (this.column && this.column.id) {
      this.contentAPI.getContentList(this.column.id).subscribe(data => {
        this.contents = data;
        this.contents.forEach((content, index) => {
          if (content.sequence != index) {
            content.sequence = index;
            if (content.id) {
              this.contentAPI.updateContent(content.id, content).subscribe();
            }
          }
        });
      });
    }
  }

  selectColumnItem(event: ItemSelectEvent) {
    this.router.navigate(['admin', 'cms', 'content'], { queryParams: { columnId: event.id }});
  }

  selectContent(contentId: number) {
    this.router.navigate(['admin', 'cms', 'content', contentId]);
  }

  quitContentEditor() {
    if (this.content) {
      this.router.navigate(['admin', 'cms', 'content'], { queryParams: { columnId: this.content.column.id }});
    }
  }

  selectTab(event: MatTabChangeEvent) {
    if (event.tab.textLabel == 'Article') {
      this.readyToShowEditor = true;
    } else {
      this.readyToShowEditor = false;
    }
  }

  setCurrentColumn(columnId: number) {
    const column = this.columns.find(column => column.id == columnId);
    if (column) {
      this.column = column;
      this.getContentList();
    }
  }

  setCurrentContent(contentId: number) {
    this.contentAPI.getContent(contentId).subscribe(data => {
      this.content = data;

      this.formGroup = this.formBuilder.group({
        'type': [this.content.type, Validators.required],
        'title': [this.content.title, Validators.required],
        'subtitle': [this.content.subtitle, null],
        'description': [this.content.description, null],
        'disabled': [this.content.disabled, null],
      });

      this.editorConfig.uploadUrl = environment.apipath + '/api/open/upload/content/' + this.content.id;

      if (this.content && this.content.article) {
        this.applicationAPI.getStorageServerPath().subscribe(
          serverPath => {
            if (this.content && this.content.article) {
              const url = serverPath + 'content/' + contentId + '/' + this.content.article;

              this.http.get(url, { responseType: 'text', withCredentials: false }).subscribe(
                result => {
                  this.editorContent = this.contentService.decodeFromBlob(result);
                }
              );
            }
          }
        );
      }

      this.formGroupLink = this.formBuilder.group({
        'link': [this.content.link, Validators.required],
      });
    });
  }

  newContent() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    if (this.column) {
      const content: Content = {
        id: null,
        ownerId: null,
        name: this.formGroupNew.value.title,
        sequence: this.contents.length,
        containerType: 'column',
        containerId: this.column.id,
        type: this.formGroupNew.value.type,
        column: this.column,
        title: this.formGroupNew.value.title,
        subtitle: this.formGroupNew.value.subtitle,
        description: this.formGroupNew.value.description,
        disabled: this.formGroupNew.value.disabled,
        createTime: null,
        updateTime: null,
      };
      this.contentAPI.addContent(content).subscribe(() => {
        this.getContentList();
      });
      this.formGroupNew = this.formBuilder.group({
        'type': ['article', Validators.required],
        'title': ['', Validators.required],
        'subtitle': ['', null],
        'description': ['', null],
        'disabled': [true, null],
      });
      this.showNewForm = false;
    }
  }

  updateContent() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.content && this.content.id) {
      this.content.type = this.formGroup.value.type;
      this.content.name = this.formGroup.value.title;
      this.content.title = this.formGroup.value.title;
      this.content.subtitle = this.formGroup.value.subtitle;
      this.content.disabled = this.formGroup.value.disabled;
      this.content.description = this.formGroup.value.description;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  deleteContent() {
    if (this.content && this.content.id) {
      this.contents.splice(this.contents.indexOf(this.content), 1);
      this.table?.renderRows();
      this.contentAPI.removeContent(this.content.id).subscribe();
      this.router.navigate(['admin', 'cms', 'content'], { queryParams: { columnId: this.content.id }});
    }
  }

  changeFeedsThumb(event: ContentChangeEvent) {
    if (this.content && this.content.id) {
      this.content.feedsThumb = event.hash;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  saveArticle() {
      const article: string = this.contentService.encodeToBlob(this.editorContent);
      const file: File = new File([article], 'article');

      if (this.content && this.content.id) {
        this.uploadAPI.upload('content', this.content.id, file).subscribe(data => {
          if (this.content && this.content.id) {
            if (data.uploaded == 1 && data.fileName) {
              this.content.article = data.fileName;

              this.contentAPI.updateContent(this.content.id, this.content).subscribe();
            }
          }
        });
      }
  }

  changePoster(event: ContentChangeEvent) {
    if (this.content && this.content.id) {
      this.content.poster = event.hash;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  changeVideo(event: ContentChangeEvent) {
    if (this.content && this.content.id) {
      this.content.video = event.hash;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  changePdf(event: ContentChangeEvent) {
    if (this.content && this.content.id) {
      this.content.pdf = event.hash;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  saveLink() {
    if (this.content && this.content.id) {
      this.content.link = this.formGroupLink.value.link;

      this.contentAPI.updateContent(this.content.id, this.content).subscribe();
    }
  }

  dropContent(event: CdkDragDrop<Content[]>) {
    moveItemInArray(this.contents, event.previousIndex, event.currentIndex);
    this.contents.forEach((content, index) => {
      if (content.sequence != index) {
        content.sequence = index;
        if (content.id) {
          this.contentAPI.updateContent(content.id, content).subscribe();
        }
      }
    });
    this.table?.renderRows();
  }

  dropped(event: CKEditor4.EventInfo) {
    setTimeout(function() {
      event.editor.fire('change');
    }, 0);
  }

}
