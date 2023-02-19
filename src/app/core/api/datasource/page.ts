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

export interface Page<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

export type PaginatedEndpoint<T, Q> = (req: PageRequest<T>, query: Q) => Observable<Page<T>>;
