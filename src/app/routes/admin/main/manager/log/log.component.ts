import { AfterViewInit, Component, DoCheck, KeyValueDiffer, KeyValueDiffers, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Log, LogAPI, PaginatedDataSource, Sort, DateRangeQuery } from '../../../../../core';

@Component({
  selector: 'berry-log-manager',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
})
export class LogManagerComponent implements AfterViewInit, DoCheck {
  displayedColumns: string[] = ['createTime', 'level', 'username', 'requestMethod', 'requestResourceType', 'requestResourceId', 'responseCode'];
  initialSort: Sort<Log> = {property: 'createTime', order: 'asc'};
  initialQuery: DateRangeQuery = {start: '', end: ''};
  @ViewChild(MatSort, {static: true}) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  clear = new UntypedFormGroup({
    clear: new UntypedFormControl()
  });
  range = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });
  differ: KeyValueDiffer<string, unknown> = this.differs.find(this.range.value).create();

  data = new PaginatedDataSource<Log, DateRangeQuery>(
    (request, query) => this.logAPI.getLogList(request, query),
    this.initialSort,
    this.initialQuery,
    10
  );

  constructor(
    private readonly differs: KeyValueDiffers,
    private logAPI: LogAPI,
  ) { }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(sort => {
        if (sort.direction == '') {
          sort.active = this.initialSort.property;
          sort.direction = this.initialSort.order;
        }
        this.data.sortBy({property: sort.active as keyof Log, order: sort.direction});
      });
    }
    this.differ = this.differs.find(this.range.value).create();
    this.clear.setValue({clear: false});
  }

  ngDoCheck(): void {
    const changes = this.differ.diff(this.range.value);
    if (changes) {
      if (this.range.value.start && this.range.value.end) {
        this.data.queryBy({
          start: new Date(Date.parse(this.range.value.start)).toISOString(),
          end: new Date(Date.parse(this.range.value.end) + 86400000).toISOString()
        });
      }
    }
  }

  download() {
    let range: DateRangeQuery | null = null;

    if (this.range.value.start && this.range.value.end) {
      range = {
        start: new Date(Date.parse(this.range.value.start)).toISOString(),
        end: new Date(Date.parse(this.range.value.end) + 86400000).toISOString()
      };
    }

    this.logAPI.download(range, this.clear.value.clear).subscribe(data => {
      const contentType = 'application/vnd.ms-excel';
      const blob = new Blob([data], { type: contentType });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'log.xlsx';
      a.click();

      window.URL.revokeObjectURL(url);

      this.data.fetch(0);
    });
  }

}
