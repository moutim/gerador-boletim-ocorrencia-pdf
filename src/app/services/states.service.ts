import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  constructor(private http: HttpClient) { }

  getStates() {
    return this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  }
}
