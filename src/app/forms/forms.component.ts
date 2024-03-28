import { Component } from '@angular/core';
import { CreatePdfService } from '../services/create-pdf.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatesService } from '../services/states.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  forms: FormGroup = this.formBuilder.group({});
  states: [] = [];

  constructor(
    private pdfService: CreatePdfService,
    private formBuilder: FormBuilder,
    private stateService: StatesService
  ) { }

  ngOnInit() {
    this.forms = this.formBuilder.group({
      identificacao: [null, [Validators.required, Validators.minLength(3)]],
      delegacia: [null, [Validators.required]],
      numeroIPL: [null, Validators.required],
      flagrante: [null, Validators.required]
    });

    this.getStates();
  }

  getStates() {
    this.stateService.getStates().subscribe({
      next: (result: any) => {
        this.states = result;
      }
    })
  }

  onSubmit() {
    console.log(this.forms.value);
  }

  createPDF() {
    this.pdfService.createPDF();
  }
}
