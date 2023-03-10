import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Carousel, Column, Content, Gallery, Page, PageRequest, Picture, Popup, Tag, Topic } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenCMSAPI {

  constructor(
    private http: HttpClient
  ) { }

  getCarouselList(list: string): Observable<Carousel[]> {
    const params = new HttpParams()
      .set('list', list);

    return this.http.get<Carousel[]>(environment.apipath + '/api/open/carousel', { params: params, withCredentials: true });
  }

  getCarousel(id: number): Observable<Carousel> {
    return this.http.get<Carousel>(environment.apipath + '/api/open/carousel/' + id, { withCredentials: true });
  }

  getColumnListByParent(parentColumnId: number): Observable<Column[]> {
    const params = new HttpParams()
      .set('parentColumnId', parentColumnId.toString());

    return this.http.get<Column[]>(environment.apipath + '/api/open/column', { params: params, withCredentials: true });
  }

  getColumnListByTopic(topicId: number): Observable<Column[]> {
    const params = new HttpParams()
      .set('topicId', topicId.toString());

    return this.http.get<Column[]>(environment.apipath + '/api/open/column/topic', { params: params, withCredentials: true });
  }

  getColumnById(rootColumnId: number | null, id: number): Observable<Column> {
    let params = new HttpParams();
    if (rootColumnId) {
      params = params.set('rootColumnId', rootColumnId.toString());
    }

    return this.http.get<Column>(environment.apipath + '/api/open/column/' + id, { params: params, withCredentials: true });
  }

  getColumnByName(rootColumnId: number | null, name: string): Observable<Column> {
    let params = new HttpParams();
    if (rootColumnId) {
      params = params.set('rootColumnId', rootColumnId.toString());
    }

    return this.http.get<Column>(environment.apipath + '/api/open/column/' + name, { params: params, withCredentials: true });
  }

  getContentList(columnId: number, request: PageRequest<Content>): Observable<Page<Content>> {
    let params = new HttpParams()
      .set('columnId', columnId.toString())
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Content>>(environment.apipath + '/api/open/content', { params: params, withCredentials: true });
  }

  getContent(id: number): Observable<Content> {
    return this.http.get<Content>(environment.apipath + '/api/open/content/' + id, { withCredentials: true });
  }

  getGalleryListByType(type: string, request: PageRequest<Gallery>): Observable<Page<Gallery>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/open/gallery/type', { params: params, withCredentials: true });
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

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/open/gallery/tag', { params: params, withCredentials: true });
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

    return this.http.get<Page<Gallery>>(environment.apipath + '/api/open/gallery/topic', { params: params, withCredentials: true });
  }

  getGallery(id: number): Observable<Gallery> {
    return this.http.get<Gallery>(environment.apipath + '/api/open/gallery/' + id, { withCredentials: true });
  }

  getPictureList(galleryId: number): Observable<Picture[]> {
    const params = new HttpParams()
      .set('galleryId', galleryId.toString());

    return this.http.get<Picture[]>(environment.apipath + '/api/open/picture', { params: params, withCredentials: true });
  }

  getPicture(id: number): Observable<Picture> {
    return this.http.get<Picture>(environment.apipath + '/api/open/picture/' + id, { withCredentials: true });
  }

  getPopupList(list: string, openid: string): Observable<Popup[]> {
    const params = new HttpParams()
      .set('list', list)
      .set('openid', openid);

    return this.http.get<Popup[]>(environment.apipath + '/api/open/popup', { params: params, withCredentials: true });
  }

  getPopup(id: number): Observable<Popup> {
    return this.http.get<Popup>(environment.apipath + '/api/open/popup/' + id, { withCredentials: true });
  }

  getTagListByType(type: string, request: PageRequest<Tag>): Observable<Page<Tag>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Tag>>(environment.apipath + '/api/open/tag/type', { params: params, withCredentials: true });
  }

  getTag(id: number): Observable<Tag> {
    return this.http.get<Tag>(environment.apipath + '/api/open/tag/' + id, { withCredentials: true });
  }

  getTopicListByType(type: string, request: PageRequest<Topic>): Observable<Page<Topic>> {
    let params = new HttpParams()
      .set('type', type)
      .set('page', request.page.toString())
      .set('size', request.size.toString());
    if (request.sort) {
      params = params
        .set('sort', request.sort.property)
        .set('order', request.sort.order);
    }

    return this.http.get<Page<Topic>>(environment.apipath + '/api/open/topic/type', { params: params, withCredentials: true });
  }

  getTopic(id: number): Observable<Topic> {
    return this.http.get<Topic>(environment.apipath + '/api/open/topic/' + id, { withCredentials: true });
  }

}
