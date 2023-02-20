import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenIPAddressAPI {

  constructor(
    private http: HttpClient
  ) { }

  resolveIPAddressRegion(ip: string, level: number): Observable<string> {
    const params = new HttpParams()
      .set('ip', ip)
      .set('level', level.toString());

    return this.http.get(environment.apipath + '/api/open/ip', { params: params, responseType: 'text', withCredentials: true });
  }

}
