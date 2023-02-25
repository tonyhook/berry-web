import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, Tag } from '../..';

@Injectable({
  providedIn: 'root',
})
export class TagAPI {

  constructor(
    private http: HttpClient
  ) { }

  getTagList(type: string, request: PageRequest<Tag>): Observable<Page<Tag>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Tag>>(environment.apipath + '/api/managed/tag/type', { params: params, withCredentials: true });
  }

  getTag(id: number): Observable<Tag> {
    return this.http.get<Tag>(environment.apipath + '/api/managed/tag/' + id, { withCredentials: true });
  }

  addTag(newTag: Tag): Observable<Tag> {
    return this.http.post<Tag>(environment.apipath + '/api/managed/tag', newTag, { withCredentials: true });
  }

  updateTag(id: number, newTag: Tag): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/tag/' + id, newTag, { withCredentials: true });
  }

  removeTag(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/tag/' + id, { withCredentials: true });
  }

}
