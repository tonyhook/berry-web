import { Observable } from 'rxjs';

export interface Sort<T> {
  property: keyof T;
  order: 'asc' | 'desc';
}

export interface PageRequest<T> {
  page: number;
  size: number;
  sort: Sort<T> | null;
}

export interface Paginator {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Page<T> {
  content: T[];
  page: Paginator;
}

export type PaginatedEndpoint<T, Q> = (req: PageRequest<T>, query: Q) => Observable<Page<T>>;
