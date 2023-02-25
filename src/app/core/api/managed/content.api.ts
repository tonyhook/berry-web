import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Content } from '../..';

@Injectable({
  providedIn: 'root',
})
export class ContentAPI {

  constructor(
    private http: HttpClient
  ) { }

  getContentList(columnId: number): Observable<Content[]> {
    const params = new HttpParams()
      .set('columnId', columnId.toString());

    return this.http.get<Content[]>(environment.apipath + '/api/managed/content', { params: params, withCredentials: true });
  }

  getContent(id: number): Observable<Content> {
    return this.http.get<Content>(environment.apipath + '/api/managed/content/' + id, { withCredentials: true });
  }

  addContent(newContent: Content): Observable<Content> {
    return this.http.post<Content>(environment.apipath + '/api/managed/content', newContent, { withCredentials: true });
  }

  updateContent(id: number, newContent: Content): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/content/' + id, newContent, { withCredentials: true });
  }

  removeContent(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/content/' + id, { withCredentials: true });
  }

}
