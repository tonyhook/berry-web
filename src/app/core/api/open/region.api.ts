import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { RegionChina, RegionWorld } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OpenRegionAPI {

  constructor(
    private http: HttpClient
  ) { }

  getProvinceList(): Observable<RegionChina[]> {
    return this.http.get<RegionChina[]>(environment.apipath + '/api/open/region/china/province', { withCredentials: true });
  }

  getCityList(province: string): Observable<RegionChina[]> {
    const params = new HttpParams()
      .set('province', province.toString());

    return this.http.get<RegionChina[]>(environment.apipath + '/api/open/region/china/city', { params: params, withCredentials: true });
  }

  getCountyList(city: string): Observable<RegionChina[]> {
    const params = new HttpParams()
      .set('city', city.toString());

    return this.http.get<RegionChina[]>(environment.apipath + '/api/open/region/china/county', { params: params, withCredentials: true });
  }

  getRegionChina(code: string): Observable<RegionChina> {
    const params = new HttpParams()
      .set('code', code);

    return this.http.get<RegionChina>(environment.apipath + '/api/open/region/china/code', { params: params, withCredentials: true });
  }

  getRegionList(name: string): Observable<RegionChina[]> {
    const params = new HttpParams()
      .set('name', name);

    return this.http.get<RegionChina[]>(environment.apipath + '/api/open/region/china/name', { params: params, withCredentials: true });
  }

  getRegionWorld(code: string): Observable<RegionWorld> {
    const params = new HttpParams()
      .set('code', code);

    return this.http.get<RegionWorld>(environment.apipath + '/api/open/region/world/code', { params: params, withCredentials: true });
  }

}
