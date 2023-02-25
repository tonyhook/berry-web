import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Picture } from '../..';

@Injectable({
  providedIn: 'root',
})
export class PictureAPI {

  constructor(
    private http: HttpClient
  ) { }

  getPictureList(galleryId: number): Observable<Picture[]> {
    const params = new HttpParams()
      .set('galleryId', galleryId.toString());

    return this.http.get<Picture[]>(environment.apipath + '/api/managed/picture', { params: params, withCredentials: true });
  }

  getPicture(id: number): Observable<Picture> {
    return this.http.get<Picture>(environment.apipath + '/api/managed/picture/' + id, { withCredentials: true });
  }

  addPicture(newPicture: Picture): Observable<Picture> {
    return this.http.post<Picture>(environment.apipath + '/api/managed/picture', newPicture, { withCredentials: true });
  }

  updatePicture(id: number, newPicture: Picture): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/picture/' + id, newPicture, { withCredentials: true });
  }

  removePicture(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/picture/' + id, { withCredentials: true });
  }

}
