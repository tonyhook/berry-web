import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { startWith, switchMap, share, map } from 'rxjs/operators';

import { Page, PaginatedEndpoint, Sort } from './page';
import { indicate } from './operators';

export interface SimpleDataSource<T> extends DataSource<T> {
  connect(): Observable<T[]>;
  disconnect(): void;
}

export class PaginatedDataSource<T, Q> implements SimpleDataSource<T> {
  pageNumber = new Subject<number>();
  sort: BehaviorSubject<Sort<T>>;
  query: BehaviorSubject<Q>;
  loading = new Subject<boolean>();

  public loading$: Observable<boolean> = this.loading.asObservable();
  public page$: Observable<Page<T>>;

  constructor(
    private endpoint: PaginatedEndpoint<T, Q>,
    private initialSort: Sort<T>,
    private initialQuery: Q,
    private pageSize: number = 10
  ) {
    this.query = new BehaviorSubject<Q>(this.initialQuery);
    this.sort = new BehaviorSubject<Sort<T>>(this.initialSort);
    const param$ = combineLatest([this.query, this.sort]);
    this.page$ = param$.pipe(
      switchMap(([query, sort]) => this.pageNumber.pipe(
        startWith(0),
        switchMap(page => this.endpoint({page, sort, size: this.pageSize}, query)
          .pipe(indicate(this.loading))
        )
      )),
      share()
    )
  }

  sortBy(sort: Partial<Sort<T>>): void {
    const lastSort = this.sort.getValue();
    const nextSort = {...lastSort, ...sort};
    this.sort.next(nextSort);
  }

  queryBy(query: Partial<Q>): void {
    const lastQuery = this.query.getValue();
    const nextQuery = {...lastQuery, ...query};
    this.query.next(nextQuery);
  }

  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(map(page => page.content));
  }

  disconnect(): void {
    return;
  }

}
