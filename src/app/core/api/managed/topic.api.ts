import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Page, PageRequest, Topic } from '../..';

@Injectable({
  providedIn: 'root',
})
export class TopicAPI {

  constructor(
    private http: HttpClient
  ) { }

  getTopicList(type: string, request: PageRequest<Topic>): Observable<Page<Topic>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Topic>>(environment.apipath + '/api/managed/topic/type', { params: params, withCredentials: true });
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(environment.apipath + '/api/managed/topic/' + id, { withCredentials: true });
  }

  addTopic(newTopic: Topic): Observable<Topic> {
    return this.http.post<Topic>(environment.apipath + '/api/managed/topic', newTopic, { withCredentials: true });
  }

  updateTopic(id: number, newTopic: Topic): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/topic/' + id, newTopic, { withCredentials: true });
  }

  removeTopic(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/topic/' + id, { withCredentials: true });
  }

}
