import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Popup } from '../..';

@Injectable({
  providedIn: 'root',
})
export class PopupAPI {

  constructor(
    private http: HttpClient
  ) { }

  getPopupList(list: string): Observable<Popup[]> {
    const params = new HttpParams()
     .set('list', list);

    return this.http.get<Popup[]>(environment.apipath + '/api/managed/popup', { params: params, withCredentials: true });
  }

  getPopup(id: number): Observable<Popup> {
    return this.http.get<Popup>(environment.apipath + '/api/managed/popup/' + id, { withCredentials: true });
  }

  addPopup(newPopup: Popup): Observable<Popup> {
    return this.http.post<Popup>(environment.apipath + '/api/managed/popup', newPopup, { withCredentials: true });
  }

  updatePopup(id: number, newPopup: Popup): Observable<unknown> {
    return this.http.put(environment.apipath + '/api/managed/popup/' + id, newPopup, { withCredentials: true });
  }

  removePopup(id: number): Observable<unknown> {
    return this.http.delete(environment.apipath + '/api/managed/popup/' + id, { withCredentials: true });
  }

}
