import { Component } from '@angular/core';
import { CreatePdfService } from '../services/create-pdf.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StatesService } from '../services/states.service';
import { LawsService } from '../services/laws.service';

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
  filteredCounties: any[] = [];
  laws: [] = [];
  filteredLaws: any[] = [];
  loading: boolean = false;

  constructor(
    private pdfService: CreatePdfService,
    private formBuilder: FormBuilder,
    private stateService: StatesService,
    private lawService: LawsService
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
      infracaoPersonalizada: [null, Validators.required],
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
      filter: [null, Validators.required],
    });

    this.getLaws();
    this.getStates();

    this.forms.get('UF')!.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.getCounties(this.forms.value.UF);
      }, 200);
    });

    this.forms.get('UFNascimento')!.valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.getCounties(this.forms.value.UFNascimento);
      }, 200)
    });

    this.forms.get('CEP')!.valueChanges.subscribe((value) => {
      if (value.length == 8) {
        this.getAddress(value);
      }
    });

    this.forms.get('municipio')!.valueChanges.subscribe((value) => {
      this.findCounties(value);
    });

    this.forms.get('municipioNascimento')!.valueChanges.subscribe((value) => {
      this.findCounties(value);
    });

    this.forms.get('infracao')!.valueChanges.subscribe((value) => {
      this.findLaws(value);
    });
  }

  onSubmit() {
    this.loading = true;

    const result = this.pdfService.createPDF(this.forms.value);

    if (result) this.loading = false;
  }

  getLaws() {
    this.lawService.getLaws().subscribe({
      next: (result: any) => {
        result.data.returnData.forEach((law: any) => {
          law.value = `${law.mnemonico} - ${law.descricao}`
        });
        this.laws = result.data.returnData;
        this.filteredLaws = result.data.returnData;
      }
    });
  }

  findLaws(term: string) {
    if (term == '' || term == null) {
      this.filteredLaws = this.laws;
      return;
    }

    this.filteredLaws = this.laws.filter((law: any) => {
      if (
        law.descricao.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >= 0
        || law.mnemonico.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >= 0
      ) return true;
      return false;
    });
  }


  getStates() {
    this.stateService.getStates().subscribe({
      next: (result: any) => {
        this.states = result;
        this.bornStates = result;
        this.statesDocument = result;
      }
    });
  }

  getCounties(UF: string) {
    this.stateService.getCounties(UF).subscribe({
      next: (result: any) => {
        this.counties = [];
        this.counties = result;
        this.filteredCounties = result;
      }
    });
  }

  findCounties(term: string) {
    if (term == '' || term == null) {
      this.filteredCounties = this.counties;
      return;
    }

    this.filteredCounties = this.counties.filter((country: any) => {
      if (country.nome.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) >= 0) return true;
      return false;
    });
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
    });
  }
}
