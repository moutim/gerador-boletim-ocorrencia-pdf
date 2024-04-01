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

  getCounties(UF: string) {
    return this.http.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${UF}/municipios`);
  }

  getAddress(CEP: string) {
    return this.http.get(`https://viacep.com.br/ws/${CEP}/json/`);
  }
}
