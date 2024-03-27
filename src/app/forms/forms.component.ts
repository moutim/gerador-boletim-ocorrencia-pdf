import { Component } from '@angular/core';
import { CreatePdfService } from '../services/create-pdf.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  constructor(
    private pdfService: CreatePdfService
  ) { }

  createPDF() {
    this.pdfService.createPDF();
  }
}
