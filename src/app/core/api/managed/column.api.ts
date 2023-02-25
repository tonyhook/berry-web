import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Column } from '../..';

@Injectable({
  providedIn: 'root',
})
export class ColumnAPI {

  constructor(
    private http: HttpClient
  ) { }

  getColumnList(): Observable<Column[]> {
    return this.http.get<Column[]>(environment.apipath + '/api/managed/column', { withCredentials: true });
  }

  getColumn(id: number): Observable<Column> {
    return this.http.get<Column>(environment.apipath + '/api/managed/column/' + id, { withCredentials: true });
  }

  addColumn(newColumn: Column): Observable<Column> {
    return this.http.post<Column>(environment.apipath + '/api/managed/column', newColumn, { withCredentials: true });
  }

  updateColumn(id: number, newColumn: Column): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/column/' + id, newColumn, { withCredentials: true });
  }

  removeColumn(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/column/' + id, { withCredentials: true });
  }

}
