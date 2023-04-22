import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenApplicationAPI {

  constructor(
    private http: HttpClient
  ) { }

  getStorageServerPath(): Observable<string> {
    return this.http.get(environment.apipath + '/api/open/application/serverpath', { responseType: 'text', withCredentials: true });
  }

}
