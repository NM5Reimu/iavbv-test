import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ReportsResponce } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }

  getReports() {
    return this.http.get<ReportsResponce>('../../assets/salereports.json')
  }
}
