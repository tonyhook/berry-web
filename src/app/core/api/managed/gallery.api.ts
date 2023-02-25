import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Gallery, Page, PageRequest } from '../..';

@Injectable({
  providedIn: 'root',
})
export class GalleryAPI {

  constructor(
    private http: HttpClient
  ) { }

  getGalleryList(type: string, request: PageRequest<Gallery>): Observable<Page<Gallery>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/managed/gallery/type', { params: params, withCredentials: true });
  }

  getGalleryListByTopic(topicId: number, request: PageRequest<Gallery>): Observable<Page<Gallery>> {
    let params = new HttpParams()
      .set('topicId', topicId.toString())
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/managed/gallery/topic', { params: params, withCredentials: true });
  }

  getGalleryListByTag(tagId: number, request: PageRequest<Gallery>): Observable<Page<Gallery>> {
    let params = new HttpParams()
      .set('tagId', tagId.toString())
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/managed/gallery/tag', { params: params, withCredentials: true });
  }

  getGallery(id: number): Observable<Gallery> {
    return this.http.get<Gallery>(environment.apipath + '/api/managed/gallery/' + id, { withCredentials: true });
  }

  addGallery(newGallery: Gallery): Observable<Gallery> {
    return this.http.post<Gallery>(environment.apipath + '/api/managed/gallery', newGallery, { withCredentials: true });
  }

  updateGallery(id: number, newGallery: Gallery): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/gallery/' + id, newGallery, { withCredentials: true });
  }

  removeGallery(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/gallery/' + id, { withCredentials: true });
  }

}
