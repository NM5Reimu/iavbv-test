import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AgentsResponce } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AgentsService {

  constructor(private http: HttpClient) { }

  getAgents() {
    return this.http.get<AgentsResponce>('../../assets/agents.json')
  }
}
