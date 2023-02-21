import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenPhoneAPI {

  constructor(
    private http: HttpClient
  ) { }

  getPhoneInfo(prefix: string): Observable<string> {
    const params = new HttpParams()
      .set('prefix', prefix);

    return this.http.get(environment.apipath + '/api/open/phone', { params: params, responseType: 'text', withCredentials: true });
  }

}
