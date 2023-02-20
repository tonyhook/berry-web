import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Upload } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenUploadAPI {

  constructor(
    private http: HttpClient
  ) { }

  upload(type: string, id: number | string, file: File): Observable<Upload> {
    const url = environment.apipath + '/api/open/upload/'
      + type + '/'
      + id;
    const formData = new FormData();
    formData.append('upload', file);
    return this.http.post<Upload>(url, formData, { withCredentials: true });
  }

  uploadEx(type: string, id: number | string, group: string, total: number, page: number, file: File): Observable<Upload> {
    const url = environment.apipath + '/api/open/upload/'
      + type + '/'
      + id + '/'
      + group + '/'
      + total + '/'
      + page;
    const formData = new FormData();
    formData.append('upload', file);
    return this.http.post<Upload>(url, formData, { withCredentials: true });
  }

}
