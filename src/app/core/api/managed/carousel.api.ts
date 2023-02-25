import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Carousel } from '../..';

@Injectable({
  providedIn: 'root',
})
export class CarouselAPI {

  constructor(
    private http: HttpClient
  ) { }

  getCarouselList(list: string): Observable<Carousel[]> {
    const params = new HttpParams()
      .set('list', list);

    return this.http.get<Carousel[]>(environment.apipath + '/api/managed/carousel', { params: params, withCredentials: true });
  }

  getCarousel(id: number): Observable<Carousel> {
    return this.http.get<Carousel>(environment.apipath + '/api/managed/carousel/' + id, { withCredentials: true });
  }

  addCarousel(newCarousel: Carousel): Observable<Carousel> {
    return this.http.post<Carousel>(environment.apipath + '/api/managed/carousel', newCarousel, { withCredentials: true });
  }

  updateCarousel(id: number, newCarousel: Carousel): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/carousel/' + id, newCarousel, { withCredentials: true });
  }

  removeCarousel(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/carousel/' + id, { withCredentials: true });
  }

}
