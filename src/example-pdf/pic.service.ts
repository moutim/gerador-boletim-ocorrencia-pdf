/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import config from '../../../core/config/app-config';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { IApiResponseGeneric } from 'src/app/shared/interfaces/api-response.interface';
import { concatMap } from 'rxjs';
import {
    TOAST_STATE,
    ToastService,
} from 'src/app/shared/components/toast/toast.service';
import { SpinnerService } from 'src/app/shared/components/spinner/spinner.service';
import { IMAGEM_ANOMALIA_IMPOSSIBILIDADE_COLETA, IMAGEM_DIREITA_GIRADO, IMAGEM_ESQUERDA_GIRADO } from 'src/app/shared/constants/constants';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root',
})
export class PicService {
    constructor(
        private readonly http: HttpClient,
        private toastService: ToastService,
        private spinnerService: SpinnerService
    ) {}

    private baseApiUrl = config.http.API_COMMON_V1;
    private obitoApiCertidaoUrl = config.http.API_OBITO_CERTIDAO;

    makePdf(pedido: number | string) {
        const dados: any = { instituto: {}, pedido: {} };
        this.spinnerService.showSpinner();

        this.getParametrosInstitucionais()
            .pipe(
                concatMap((paramInstitucional) => {
                    dados.instituto = paramInstitucional.body?.data;
                    return this.getPedido(pedido as number);
                }),
                concatMap((pic) => {
                    dados.pedido = pic.body?.data[0];
                    return this.getUfById(dados.instituto.codigoUF);
                })
            )
            .subscribe({
                next: (uf) => {
                    dados.instituto.nomeUf = uf.body?.data.nome;
                    dados.instituto.siglaUf = uf.body?.data.descricao;
                    dados.pedido.numeroPedido = pedido;
                    dados.biometria = {palmar: []};
                    pdfMake
                        .createPdf(this.makeDocumentDefinition(dados))
                        .open();
                },
                error: (error) => {
                    console.log(error);
                    this.toastService.showToast(
                        TOAST_STATE.danger,
                        'Houve um problema com a geração do PIC'
                    );
                    this.spinnerService.dismissSpinner();
                },
                complete: () => {
                    this.spinnerService.dismissSpinner();
                },
            });
    }

    makeDocumentDefinition(dados: any): TDocumentDefinitions {
        console.log(dados);
        const docDefinition: TDocumentDefinitions = {
            info: {
                title: `Pedido de Identificação Criminal  - Pedido: ${dados.pedido.numeroPedido}`,
            },
            pageSize: 'A4',
            pageMargins: [20, 120, 20, 40],
            header: [
                {
                    columns: [
                        {
                            image:
                                'data:image/jpeg;base64,' +
                                dados.instituto.logotipo,
                            width: 80,
                        },
                        {
                            stack: [
                                {
                                    text: `Governo do Estado de ${dados.instituto.nomeUf}`,
                                    fontSize: 15,
                                },
                                {
                                    text: dados.instituto.nomeSecretario,
                                    fontSize: 11,
                                },
                                {
                                    text: dados.instituto.nomeInstituto,
                                    fontSize: 11,
                                },
                                {
                                    text: 'PIC - Pedido de Identificação Criminal',
                                    fontSize: 10,
                                },
                            ],
                            width: '*',
                            margin: [0, 20, 0, 0],
                            bold: true,
                        },
                        {
                            stack: [
                                {
                                    text: [
                                        { text: 'Emissão:', bold: true },
                                        moment().format('DD/MM/YYYY'),
                                    ],
                                },
                                {
                                    text: [
                                        { text: 'Login:', bold: true },
                                        localStorage.getItem('login') as string,
                                    ],
                                },
                            ],
                            width: 'auto',
                            margin: [0, 60, 0, 0],
                            fontSize: 9,
                        },
                    ],
                    columnGap: 10,
                    margin: [20, 20, 20, 0],
                },
            ],
            content: {
                stack:[
                    {
                        columns: [
                            {
                                text: [
                                    { text: 'Nº PIC  ', bold: true },
                                    { text: dados.pedido.numeroPedido },
                                ], 
                            },
                            {
                                text: [
                                    { text: 'Nº RC  ', bold: true },
                                    { text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.numeroRC : ' ' },
                                ],
                                alignment: 'right',
                            },
                        ],
                        margin: [50, 0, 50, 20]
                    },
                    {
                        table: {
                            widths: [80, '*', 20, 80, 80, 80],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'TIPO DE IDENTIFICAÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.txMnemo,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'DELEGACIA/ÓRGÃO INSTAURADOR DO IPL PROCESSO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.txOrgao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 3,
                                    },
                                    {},
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'NÚMERO DE IPL/TCO/LRE',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.numeroInq : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'FLAGRANTE',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoCriminal ? `${dados.pedido.informacaoCriminal.inFlagra === 1 ? 'SIM' : 'NÃO'}` : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'MUNICÍPIO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.nomeMunOrgao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2,
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'UF',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.siglaUFOrgao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'AUTUAÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? moment(dados.pedido.informacaoInqueritoCidadao.dataAutua).format('DD/MM/YYYY') : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ABERTURA',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? moment(dados.pedido.informacaoInqueritoCidadao.dataAbertInq).utc().format('DD/MM/YYYY'): ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'CONCLUSÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? moment(dados.pedido.informacaoInqueritoCidadao.dataConclu).utc().format('DD/MM/YYYY') : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'NOME COMPLETO DO INDICIADO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.documentos.nomeIdent,
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 6
                                    },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'ALCUNHA(S)',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.alcun ? this.tratarAlcunhas(dados.pedido.alcun) : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 6
                                    },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'FILIAÇÃO 1',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.filiacao ? dados.pedido.filiacao[0].filiacao : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 6
                                    },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'FILIAÇÃO 2',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.filiacao ? dados.pedido.filiacao[1] ? dados.pedido.filiacao[1].filiacao : ' ' : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 6,
                                        border:[true, true, true, false]
                                    },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ],
                            ],
                        },
                    },
                    {
                        table: {
                            widths: [50,50,'*',50,80,30,80,80],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'SEXO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.descrisaoSexo,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'DATA DE NASCIMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: moment(dados.pedido.documentos.datanascimento, 'DDMMYYYY').format('DD/MM/YYYY'),
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'MUNICÍPIO DE NASCIMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.nomeMunNasc,
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'UF',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.siglaMunNasc,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'Estado Civil',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.descricaoEstCivil,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'INSTRUÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.descricaoGrauInstr,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'DOCUMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoCriminal ? dados.pedido.informacaoCriminal.descricaoTipoDOCApres : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'Nº DO DOCUMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.numeroDOC,
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'ORGÃO EXPEDIDOR',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.nomeOrgaoEmiss,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'UF',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.siglaUf,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'CPF',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.numeroCPF && dados.pedido.documentos.numeroCPF !== 0 ? dados.pedido.documentos.numeroCPF.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'POLICIAL',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoCriminal ? dados.pedido.informacaoCriminal.nomeTipoPolici : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'PAÍS DE NASCIMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.nomePaisNasc,
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 4
                                    },
                                    {},
                                    {},
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'NACIONALIDADE',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.descricaoNacion,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'TITULO DE ELEITOR/ZONA/SEÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.numeroTituloEleit && dados.pedido.documentos.numeroTituloEleit !== 0 ? `${dados.pedido.documentos.numeroTituloEleit} ${dados.pedido.documentos.numeroZonaEleit!== 0 ? `/ ${dados.pedido.documentos.numeroZonaEleit}`: '' } ${dados.pedido.documentos.numeroSecaoEleit !== 0 ? `/${dados.pedido.documentos.numeroSecaoEleit}`: ''}` : ' ',
                                                style: [{fontSize: 8, lineHeight: 0.85}],
                                            },
                                        ],
                                        colSpan:2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'Nº DE DEPENDENTES',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.numeroDepent,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'PROFISSÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.documentos.nomeProf,
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan:8,
                                        border: [true, true, true, false]
                                    },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ]
                            ]
                        }
                    },
                    {
                        table: {
                            widths: ['*','*','*','*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'ENDEREÇO (RUA/AV)',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.endereco ? dados.pedido.endereco.txLograd : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'NÚMERO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.endereco ? dados.pedido.endereco.numeroLograd : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'COMPLEMENTO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.endereco ? dados.pedido.endereco.txComplLograd : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'BAIRRO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.endereco ? dados.pedido.endereco.nomeBairro : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'MUNICÍPIO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.endereco ? dados.pedido.endereco.nomeMunNacion : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'CEP',
                                                style: 'title',
                                            },
                                            {
                                                text: `${dados.pedido.endereco ? `${dados.pedido.endereco.numeroCEP.toString().slice(0,5)}-${dados.pedido.endereco.numeroCEP.toString().slice(-3)}` : ''}`,
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'TEL (DDD E Nº)',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.telFax ? `+${dados.pedido.telFax.numeroDDI} (${dados.pedido.telFax.numeroDDD}) ${dados.pedido.telFax.numeroTelFax.toString().slice(0,-4)}-${dados.pedido.telFax.numeroTelFax.toString().slice(-4)}` : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'NOME(S) DA(S) VÍTIMA(S)',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? dados.pedido.ocorrenciaCidadao.txVitimas : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 4
                                    },
                                    {},
                                    {},
                                    {},
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'INFRAÇÃO PENAL',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoInfracaoCidadao ? dados.pedido.informacaoInfracaoCidadao.txInfrac : ' ' ,
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 4,
                                        border: [true, true, true, false]
                                    },
                                    {},
                                    {},
                                    {},
                                ],
                            ]
                        }
                    },
                    {
                        table: {
                            widths: ['*','*','*','*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'Nº DO PROCESSO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoProcessoCidadao ? dados.pedido.informacaoProcessoCidadao.numeroProc : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ÓRGÃO/VARA',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoProcessoCidadao ? dados.pedido.informacaoProcessoCidadao.txOrgao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'SITUAÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoProcessoCidadao ? dados.pedido.informacaoProcessoCidadao.descricaoStatusProcJudic : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'MANDADO DE PRISÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoMandadoPrisao ? dados.pedido.informacaoMandadoPrisao.numeroMandad : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'EXPEDIÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoMandadoPrisao ? moment(dados.pedido.informacaoMandadoPrisao.dataExpedc).utc().format('DD/MM/YYYY') : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ÓRGÃO/VARA',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoMandadoPrisao ? dados.pedido.informacaoMandadoPrisao.txOrgao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'SITUAÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoMandadoPrisao ? dados.pedido.informacaoMandadoPrisao.descricaoSituacaoMandadPrisao : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'PORTE DE ARMA',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.identificacaoCriminal ? dados.pedido.identificacaoCriminal.txPorteArma : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ÓRGÃO EMISSOR/UF',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.identificacaoCriminal ? `${dados.pedido.identificacaoCriminal.nomeOrgaoEmissorPorteArma} / ${dados.pedido.informacaoCriminal.siglaUFOrgaoEmissPorteArma}` : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                        colSpan: 2
                                    },
                                    {},
                                    {
                                        stack: [
                                            {
                                                text: 'IDENTIFICAÇÃO',
                                                style: 'title',
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? moment(dados.pedido.informacaoInqueritoCidadao.dataAutua).format('DD/MM/YYYY') : ' ',
                                                style: ['content'],
                                            },
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'OBSERVAÇÕES',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.descrisaotipoPedido === 'Identificação Direta' ? dados.pedido.descrisaotipoPedido : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 4
                                    },
                                    {},
                                    {},
                                    {},
                                ]
                            ]
                        },
                        pageBreak: 'after'
                    },
                    {
                        columns: [
                            {
                                text: [
                                    { text: 'Dados Antropométricos', bold: true },
                                ], 
                            },
                            {
                                text: [
                                    { text: 'Nº PIC  ', bold: true },
                                    { text: dados.pedido.numeroPedido },
                                ], 
                            },
                            {
                                text: [
                                    { text: 'Nº RC  ', bold: true },
                                    { text:  dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.numeroRC : ' ' },
                                ],
                                alignment: 'right',
                            },
                        ],
                        margin: [30, 0, 30, 20]
                    },
                    {
                        table: {
                            widths: ['*', '*','*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'CUTIS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txCutis : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ROSTO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txRosto : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'CABELO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txCorCabelo : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'TESTA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txTesta : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'SOMBRANCELHA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txSobran : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'OLHOS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txCorOlho : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'ORELHAS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txOrelha : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'NARIZ',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txNariz : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'BOCA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txBoca : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'LÁBIOS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txLabios : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'BIGODE',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txBigode : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'BARBA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txBarba : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'PESCOÇO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txPescoc : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ALTURA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txAltura : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'COMPLEIÇÃO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txComple : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'TATUAGENS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txTatua : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        colSpan: 3,
                                        border: [true, true, true, false]
                                    },
                                    {},
                                    {},
                                ],
                            ]
                        }
                    },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'AMPUTAÇÃO(ÕES)',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txMembroAmputa : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'DEFORMIDADES',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txDeform : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'PECULIARIDADES',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txPeculi : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'CICATRIZ(ES)',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoAntropometriaCidadao ? dados.pedido.informacaoAntropometriaCidadao.txCicatr : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'CAUSAS PRESUMÍVEIS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? dados.pedido.ocorrenciaCidadao.txCausas : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'MEIOS EMPREGADOS',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? dados.pedido.ocorrenciaCidadao.txMeios : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                            ]
                        }
                    },
                    {
                        table: {
                            widths: ['*', '*', '*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'LOCAL DA OCORRÊNCIA',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? dados.pedido.ocorrenciaCidadao.descricaoLocal : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        border:[true, false, true, false]
                                    }, 
                                    {
                                        stack: [
                                            {
                                                text: 'DATA DO FATO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? moment(dados.pedido.ocorrenciaCidadao.dataFato).utc().format('DD/MM/YYYY') : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        border:[true, false, true, false]
                                    }, 
                                    {
                                        stack: [
                                            {
                                                text: 'HORA DO FATO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.ocorrenciaCidadao ? moment(dados.pedido.ocorrenciaCidadao.dataFato).utc().format('HH:mm') : ' ',
                                                style: ['content']
                                            }
                                        ],
                                        border:[true, false, true, false]
                                    }, 
                                ],
                            ],
                        }
                    },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'ESCRIVÃO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.nomeEscriv : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'PRESIDENTE/DELEGADO DO PROCEDIMENTO',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.nomePresidProces : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'IDENTIFICADOR',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoCriminal ? dados.pedido.informacaoCriminal.operadIdentificador : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'ATENDENTE',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.informacaoCriminal ? dados.pedido.informacaoCriminal.operadAtendente : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    },
                                ],
                            ]
                        }
                    },
                    {
                        table: {
                            widths: ['*', '*', '*'],
                            body:[
                                [
                                    this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Foto', '3X4') ?
                                        {
                                            image: 'data:image/jpeg;base64,' + this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao,'Foto', '3X4'),
                                            width: 80,
                                        } :
                                        {text: 'SEM IMAGEM CAPTURADA', margin:[0, 40,0,0]},
                                    this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Foto', 'Perfil Esquerdo') ?
                                        {
                                            image: 'data:image/jpeg;base64,' + this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao,'Foto', 'Perfil Esquerdo'),
                                            width: 80,
                                        } : 
                                        {text: 'SEM IMAGEM CAPTURADA', margin:[0, 40,0,0]},
                                    this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Foto', 'Perfil Direito') ?
                                        {
                                            image: 'data:image/jpeg;base64,' + this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao,'Foto', 'Perfil Direito'),
                                            width: 80,
                                        } :
                                        {text: 'SEM IMAGEM CAPTURADA', margin:[0, 40,0,0]},
                                ]
                            ],
                        },
                        layout: 'noBorders',
                        alignment: 'center'
                    },
                    {
                        columns: [
                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Assinatura') ?
                                {
                                    image: 'data:image/jpeg;base64,' + this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao,'Assinatura'),
                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 60,270, 'Assinatura'),
                                }:
                                {text: 'SEM ASSINATURA CAPTURADA', margin: [10, 30, 0, 0]},
                            {
                                stack: [
                                    {text: '________________________________________'},
                                    {text: 'RECONHEÇO A EXATIDÃO DOS DADOS DECLARADOS', fontSize: 8}
                                ],
                                margin: [0, 40, 0, 0],
                                alignment: 'center'
                            }
                        ]
                    },
                    {
                        table: {
                            widths: [60, '*', 40, 80],
                            body: [
                                [
                                    {
                                        stack: [
                                            {
                                                text: 'DIGITAIS COLETADAS',
                                                style: 'title'
                                            },
                                            {
                                                text: 'Mãos',
                                                style: ['content']
                                            }
                                        ],
                                    }, 
                                    {
                                        stack: [
                                            {
                                                text: 'Anomalias',
                                                style: 'title'
                                            },
                                            {
                                                text: dados.pedido.anomalia ? this.tratarAnomalias(dados.pedido.anomalia) : ' ',
                                                style: ['content']
                                            }
                                        ],
                                    }, 
                                    {
                                        text: '',
                                        border:[true, false, true, false]
                                    },
                                    {
                                        stack: [
                                            {
                                                text: 'RM',
                                                style: 'title'
                                            },
                                            {
                                                text: '-',
                                                style: ['content']
                                            }
                                        ],
                                    }, 
                                ],
                            ],
                        },
                        marginBottom: 5
                    },
                    {
                        columns: [
                            { text: '', width: '*' },
                            {
                                table: {
                                    widths: [5, 100, 100, 100, 100, 100],
                                    body: [
                                        [
                                            { 
                                                image: 'data:image/jpeg;base64,' + IMAGEM_DIREITA_GIRADO,
                                                width:15,
                                                height:80,
                                                margin:[-5,5,0,0]
                                            },
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Polegar Direito') ?
                                                {
                                                    image: 'data:image/jpeg;base64,' +
                                                this.imagemPorInformacao(
                                                    dados.pedido
                                                        .informacaoImagemCidadao,
                                                    'Dedo',
                                                    'Polegar Direito'
                                                ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Polegar Direito'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Indicador Direito') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Indicador Direito'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Indicador Direito'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Médio Direito') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Médio Direito'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Médio Direito'),
                                                    alignment: 'center',
                                                } : 
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Anelar Direito') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Anelar Direito'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Anelar Direito'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Mínimo Direito') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Mínimo Direito'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Mínimo Direito'),
                                                    alignment: 'center',
                                                }:
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                        ],
                                        [
                                            {
                                                text: '',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                            },
                                            {
                                                text: 'POLEGAR',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                                alignment: 'center',
                                            },
                                            {
                                                text: 'INDICADOR',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                                alignment: 'center',
                                            },
                                            {
                                                text: 'MÉDIO',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                                alignment: 'center',
                                            },
                                            {
                                                text: 'ANELAR',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                                alignment: 'center',
                                            },
                                            {
                                                text: 'MÍNIMO',
                                                border: [
                                                    false,
                                                    true,
                                                    false,
                                                    true,
                                                ],
                                                alignment: 'center',
                                            },
                                        ],
                                        [
                                            { 
                                                image: 'data:image/jpeg;base64,' + IMAGEM_ESQUERDA_GIRADO,
                                                width:15,
                                                height:80,
                                                margin:[-5,7,0,0]
                                            },
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Polegar Esquerdo') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Polegar Esquerdo'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Polegar Esquerdo'),
                                                    alignment: 'center',
                                                }:
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Indicador Esquerdo') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Indicador Esquerdo'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Indicador Esquerdo'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Médio Esquerdo') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Médio Esquerdo'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Médio Esquerdo'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Anelar Esquerdo') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Anelar Esquerdo'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Anelar Esquerdo'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Dedo', 'Mínimo Esquerdo') ?
                                                {
                                                    image:
                                                    'data:image/jpeg;base64,' +
                                                    this.imagemPorInformacao(
                                                        dados.pedido
                                                            .informacaoImagemCidadao,
                                                        'Dedo',
                                                        'Mínimo Esquerdo'
                                                    ),
                                                    height: 80,
                                                    width: this.manterProporcaoImagem(dados.pedido.informacaoImagemCidadao, 80,80, 'Dedo', 'Mínimo Esquerdo'),
                                                    alignment: 'center',
                                                } :
                                                {text: 'SEM DIGITAL CAPTURADA', alignment: 'center', margin:[0, 40, 0, 0], color: 'red', fontSize: 8}
                                        ],
                                    ],
                                },
                                style: { fontSize: 7 },
                                width: 'auto',
                            },
                            { text: '', width: '*' },
                        ],
                        pageBreak: 'after'
                    },
                    {
                        columns: [
                            {
                                text: [
                                    { text: 'Palmar', bold: true },
                                ], 
                            },
                            {
                                text: [
                                    { text: 'Nº PIC  ', bold: true },
                                    { text: dados.pedido.numeroPedido },
                                ], 
                            },
                            {
                                text: [
                                    { text: 'Nº RC  ', bold: true },
                                    { text:  dados.pedido.informacaoInqueritoCidadao ? dados.pedido.informacaoInqueritoCidadao.numeroRC : ' ' },
                                ],
                                alignment: 'right',
                            },
                        ],
                        margin: [30, 0, 30, 20]
                    },
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [
                                    {
                                        stack:[
                                            {text: 'PALMA DIREITA', alignment: 'center', marginBottom: 20, bold: true},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Palma', 'Palma Direita') ?
                                                {
                                                    image:
                                                'data:image/jpeg;base64,' +
                                                this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao, 'Palma', 'Palma Direita'),
                                                    height: 250,
                                                    width: 250,
                                                    alignment: 'center',
                                                    marginBottom: 30
                                                } :
                                                {text: 'Sem Imagem Capturada', alignment:'center', margin:[0,50,0,50]}
                                        ]
                                    },
                                    {
                                        stack:[
                                            {text: 'LATERAL DIREITA', alignment: 'center', marginBottom: 20, bold: true},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Palma', 'Lateral Direita') ?
                                                {
                                                    image:
                                                'data:image/jpeg;base64,' +
                                                this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao, 'Palma', 'Lateral Direita'),
                                                    height: 250,
                                                    width: 250,
                                                    alignment: 'center',
                                                    marginBottom: 30
                                                } :
                                                {text: 'Sem Imagem Capturada', alignment:'center', margin:[0,50,0,50]}
                                        ]
                                    },
                                ],
                                [
                                    {
                                        stack:[
                                            {text: 'PALMA ESQUERDA', alignment: 'center', marginBottom: 20, bold: true},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Palma', 'Palma Esquerda') ?
                                                {
                                                    image:
                                                'data:image/jpeg;base64,' +
                                                this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao, 'Palma', 'Palma Esquerda'),
                                                    height: 250,
                                                    width: 250,
                                                    alignment: 'center',
                                                } : 
                                                {text: 'Sem Imagem Capturada', alignment:'center', margin:[0,50,0,50]}
                                        ]
                                    },
                                    {
                                        stack:[
                                            {text: 'LATERAL ESQUERDA', alignment: 'center', marginBottom: 20, bold: true},
                                            this.checkIfImageExists(dados.pedido.informacaoImagemCidadao, 'Palma', 'Lateral Esquerda') ? 
                                                {
                                                    image:
                                                'data:image/jpeg;base64,' +
                                                this.imagemPorInformacao(dados.pedido.informacaoImagemCidadao, 'Palma', 'Lateral Esquerda'),
                                                    height: 250,
                                                    width: 250,
                                                    alignment: 'center',
                                                } :
                                                {text: 'Sem Imagem Capturada', alignment:'center', margin:[0,50,0,50]}
                                        ]
                                    },
                                ],
                            ]
                        },
                        layout: 'noBorders'
                    }


                ],
                
                
            },
            footer: function (currentPage, pageCount) {
                return [
                    {
                        columns: [
                            {
                                stack: ['idNetBrasil - Portal', 'Vs.: 1.0.0.0'],
                                width: '*',
                                margin: [30, 0, 0, 0],
                            },
                            {
                                stack: [
                                    `Página ${currentPage.toString()} de ${pageCount.toString()}`,
                                ],
                                width: '*',
                                alignment: 'right',
                                margin: [0, 0, 30, 0],
                            },
                        ],
                        fontSize: 7,
                        bold: true,
                    },
                ];
            },
            styles: {
                title: {
                    fontSize: 6,
                    lineHeight: 0.85
                },
                content: {
                    fontSize: 9,
                    lineHeight: 0.85
                },
                center: {
                    alignment: 'center',
                }
            },
        };

        return docDefinition;
    }

    tratarAlcunhas(array: any[]) {
        let retorno = '';
        array.forEach((alcunha, index, arr) => {
            retorno = retorno + alcunha.nomeAlcun;
            if(index !== arr.length -1) {
                retorno = retorno + ', ';
            }
        });
        return retorno;
    }

    tratarAnomalias(array: any[]) {
        let retorno = '';
        array.forEach((anomalia, index, arr) => {
            retorno = retorno + anomalia.txAnomalia;
            if(index !== arr.length -1) {
                retorno = retorno + ', ';
            }
        });
        return retorno;
    }

    filtrarPalma(arrayPalmar:any[], nomePalmar:string) {
        const retorno = arrayPalmar.filter(palmar => {
            return palmar.subTipoStr === nomePalmar;
        });
        return retorno[0].imagem.imagemBase64;
    }

    imagemPorInformacao(arrayDeImagens:any[], nome:string, subNome?:string) {
        const retorno =  arrayDeImagens.filter( imagem => {
            if(subNome) {
                return imagem.nomeTipoIM.concat(' ', imagem.subNomeTipoIM) === nome.concat(' ', subNome);
            } else {
                return imagem.nomeTipoIM === nome;
            }
        });

        if(nome === 'Dedo' && retorno.length ===0) {
            return IMAGEM_ANOMALIA_IMPOSSIBILIDADE_COLETA;
        } else {
            return retorno[0].imagemBase64;
        }
    }

    checkIfImageExists(arrayDeImagens:any[], nome:string, subNome?:string) {

        const check =  arrayDeImagens.filter( imagem => {
            if(subNome) {
                return imagem.nomeTipoIM.concat(' ', imagem.subNomeTipoIM) === nome.concat(' ', subNome);
            } else {
                return imagem.nomeTipoIM === nome;
            }
        });

        if (check.length === 0) {
            return false;
        } else {
            return true;
        }

    }

    manterProporcaoImagem(arrayDeImagens: any[], alturaImagem:number,larguraFallback:number, nome: string, subNome?: string) {
        const imagem = arrayDeImagens.filter((imagem) => {
            if (subNome) {
                return (
                    imagem.nomeTipoIM.concat(' ', imagem.subNomeTipoIM) ===
                    nome.concat(' ', subNome)
                );
            } else {
                return imagem.nomeTipoIM === nome;
            }
        });

        if(imagem.length === 0) {
            return larguraFallback;
        }
        
        const proporcao = imagem[0].valorAltura/imagem[0].valorLarg;

        return alturaImagem/proporcao;
    }

    getParametrosInstitucionais() {
        return this.http.get<IApiResponseGeneric>(
            `${this.baseApiUrl}/ParametroInstitucional`,
            { observe: 'response' }
        );
    }

    getUfById(id: number) {
        return this.http.get<IApiResponseGeneric>(
            `${this.baseApiUrl}/Uf/${id}`,
            { observe: 'response' }
        );
    }

    getPedido(pedido: number) {
        return this.http.get<any>(
            `${this.obitoApiCertidaoUrl}/Detalhes/${pedido}`,
            { observe: 'response' }
        );
    }
}
