import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ContentChangeEvent, PaginatedDataSource, Sort, Topic, TopicAPI } from '../../../../../core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'berry-topic-manager',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TopicManagerComponent implements OnInit, AfterViewInit {
  type = '';

  displayedColumns: string[] = ['name'];
  initialSort: Sort<Topic> = {property: 'name', order: 'asc'};
  expandedRow: Topic | null = null;
  showNewForm = false;
  formGroup: FormGroup = this.formBuilder.group({
    'name': ['name', Validators.required],
    'disabled': [false, null],
  });
  formGroupNew: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'disabled': [true, null],
  });
  @ViewChild(MatSort, {static: false}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  data = new PaginatedDataSource<Topic, null>(
    (request) => this.topicAPI.getTopicList(this.type, request),
    this.initialSort,
    null,
    10
  );

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private topicAPI: TopicAPI,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['type'] != null) {
        if (this.type != params['type']) {
          this.type = params['type'];
          this.data = new PaginatedDataSource<Topic, null>(
            (request) => this.topicAPI.getTopicList(this.type, request),
            this.initialSort,
            null,
            10
          );
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }

        this.data.sortBy({property: sort.active as keyof Topic, order: sort.direction});
      });
    }
  }

  selectTopic(row: Topic) {
    this.expandedRow = this.expandedRow == row ? null : row;

    if (this.expandedRow) {
      this.formGroup = this.formBuilder.group({
        'name': [this.expandedRow.name, null],
        'disabled': [this.expandedRow.disabled, null],
      });
    }
  }

  newTopic() {
    if (!this.formGroupNew.valid) {
      this.formGroupNew.markAllAsTouched();
      return;
    }

    const topic: Topic = {
      id: null,
      type: this.type,
      name: this.formGroupNew.value.name,
      disabled: this.formGroupNew.value.disabled,
    };
    this.topicAPI.addTopic(topic).subscribe(() => {
      if (this.paginator) {
        this.data.fetch(this.paginator.pageIndex);
      }
    });
    this.formGroupNew = this.formBuilder.group({
      'name': ['', Validators.required],
      'disabled': [true, null],
    });
    this.showNewForm = false;
  }

  updateTopic() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.expandedRow) {
      const topic: Topic = this.expandedRow;
      topic.name = this.formGroup.value.name;
      topic.disabled = this.formGroup.value.disabled;
      if (topic.id) {
        this.topicAPI.updateTopic(topic.id, topic).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

  changeTopic(event: ContentChangeEvent) {
    if (this.expandedRow && this.expandedRow.id) {
      this.expandedRow.image = event.hash;
      this.topicAPI.updateTopic(this.expandedRow.id, this.expandedRow).subscribe();
    }
  }

  deleteTopic() {
    if (this.expandedRow) {
      const topic: Topic = this.expandedRow;
      if (topic.id) {
        this.topicAPI.removeTopic(topic.id).subscribe(() => {
          if (this.paginator) {
            this.data.fetch(this.paginator.pageIndex);
          }
        });
      }
    }
  }

}
