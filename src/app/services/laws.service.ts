import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class LawsService {
  key: string = '';
  forms: FormGroup = this.formBuilder.group({});

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ) {
    this.forms = this.formBuilder.group({
      key: [null]
    });
  }

  ngOnInit() {
    this.forms.get('key')!.valueChanges.subscribe((value) => {
      this.key = value;
    });

  }

  getLaws() {
    const headers: HttpHeaders = new HttpHeaders({
      'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjM3OTUiLCJuYmYiOjE3MTIxNTcyNTMsImV4cCI6MTcxMjI0MzY1MywiaWF0IjoxNzEyMTU3MjUzfQ.q5hCOAJw7MVzfSmeltW2AM1rs2Xf7NSP_6JYO8teM_s',
      'Content-Type': 'application/json'
    });

    return this.http.get('http://10.6.5.73:9000/api/v1/Lei?page=1&size=100', { headers });
  }
}
