import { Component } from '@angular/core';
import { CreatePdfService } from '../services/create-pdf.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StatesService } from '../services/states.service';
import { Observable, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.css'
})
export class FormsComponent {
  forms: FormGroup = this.formBuilder.group({});
  states: [] = [];
  counties: [] = [];
  bornStates: [] = [];
  bornCounties: [] = [];
  statesDocument: [] = [];

  myControl = new FormControl('');
  filteredOptions: Observable<any[]> = of([]);
  options: string[] = ['One', 'Two', 'Three'];

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
      flagrante: [null, Validators.required],
      UF: [null, Validators.required],
      municipio: [null, Validators.required],
      autuacao: [null, Validators.required],
      abertura: [null, Validators.required],
      conclusao: [null, Validators.required],
      nomeIndiciado: [null, Validators.required],
      alcunha: [null, Validators.required],
      filiacao1: [null, Validators.required],
      filiacao2: [null, Validators.required],
      sexo: [null, Validators.required],
      dataDeNascimento: [null, Validators.required],
      UFNascimento: [null, Validators.required],
      municipioNascimento: [null, Validators.required],
      estadoCivil: [null, Validators.required],
      instrucao: [null, Validators.required],
      tituloEleitor: [null, Validators.required],
      UFDocumento: [null, Validators.required],
      numeroRG: [null, Validators.required],
      numeroCPF: [null, Validators.required],
      policial: [null, Validators.required],
      dependentes: [null, Validators.required],
      profissao: [null, Validators.required],
      CEP: [null, Validators.required],
      endereco: [null, Validators.required],
      bairro: [null, Validators.required],
      municipioEstado: [null, Validators.required],
      numero: [null, Validators.required],
      complemento: [null, Validators.required],
      numeroTelefone: [null, Validators.required],
      vitimas: [null, Validators.required],
      infracao: [null, Validators.required],
      numeroProcesso: [null, Validators.required],
      orgaoProcesso: [null, Validators.required],
      situacaoProcesso: [null, Validators.required],
      numeroMandado: [null, Validators.required],
      orgaoMandado: [null, Validators.required],
      situacaoMandado: [null, Validators.required],
      expedicaoMandado: [null, Validators.required],
      porteArma: [null, Validators.required],
      orgaoEmissorArma: [null, Validators.required],
      identificacaoArma: [null, Validators.required],
      observacoes: [null, Validators.required],
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    this.getStates();

    this.setUpperCaseOnInputChange();

    this.forms.get('UF')!.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.getCounties(this.forms.value.UF);
      }, 500);

      setTimeout(() => {
        this._filter('a');
      }, 700);
    });

    this.forms.get('UFNascimento')!.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.getBornCounties(this.forms.value.UFNascimento);
      }, 500)
    });

    this.forms.get('CEP')!.valueChanges.subscribe((value) => {
      if (value.length == 8) {
        this.getAddress(value);
      }
    });
  }

  onSubmit() {
    console.log(this.forms.value);
    this.pdfService.createPDF(this.forms.value);
  }

  getStates() {
    this.stateService.getStates().subscribe({
      next: (result: any) => {
        this.states = result;
        this.bornStates = result;
        this.statesDocument = result;
      }
    })
  }

  getCounties(UF: string) {
    this.stateService.getCounties(UF).subscribe({
      next: (result: any) => {
        this.counties = [];
        this.counties = result;
        // this.filteredOptions = result;
      }
    })
  }

  getBornCounties(UF: string) {
    this.stateService.getCounties(UF).subscribe({
      next: (result: any) => {
        this.bornCounties = [];
        this.bornCounties = result;
      }
    })
  }

  getAddress(CEP: string) {
    this.stateService.getAddress(CEP).subscribe({
      next: (result: any) => {
        console.log(result);

        this.forms.patchValue({
          endereco: result.logradouro,
          bairro: result.bairro,
          municipioEstado: `${result.localidade} - ${result.uf}`
        });
      }
    })
  }

  private setUpperCaseOnInputChange() {
    Object.keys(this.forms.controls).forEach(key => {
      const control = this.forms.get(key);
      if (control) {
        control.valueChanges.subscribe(newValue => {
          if (typeof newValue === 'string') {
            control.setValue(newValue.toUpperCase(), { emitEvent: false });
          }
        });
      }
    });
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.counties.filter((option: any) => option.nome.toLowerCase().includes(filterValue));
  }
}
