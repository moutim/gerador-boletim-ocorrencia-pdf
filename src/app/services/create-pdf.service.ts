import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import images from '../../assets/images-pdf';
import { IPDFInfo } from '../interfaces/IPDFInfo';

@Injectable({
  providedIn: 'root'
})
export class CreatePdfService {
  constructor() { }

  createPDF(infos: IPDFInfo) {
    const docDefinition = {
      info: {
        title: 'Pedido de Identificação Criminal  - Pedido: 1',
      },
      content: [
        {
          columns: [
            {
              image: images.brasaoPE,
              width: 75,
            },
            {
              margin: 15,
              text: [
                { text: 'Governo do Estado de Pernambuco \n', fontSize: 14, bold: true },
                { text: 'SECRETARIA ALT \n', fontSize: 12, bold: true },
                { text: 'INSTITUTO ALT \n', fontSize: 12, bold: true },
                { text: 'PIC - Pedido de Identificação Criminal', fontSize: 10, bold: true }
              ]
            }
          ],
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
                      text: infos.identificacao || ' ',
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
                      text: infos.delegacia || ' ',
                      style: ['content'],
                    },
                  ],
                  colSpan: 3
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
                      text: infos.numeroIPL || ' ',
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
                      text: infos.flagrante,
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
                      text: infos.municipio,
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
                      text: infos.UF,
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
                      text: infos.autuacao,
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
                      text: infos.abertura,
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
                      text: infos.conclusao,
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
                      text: infos.nomeIndiciado,
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
                      text: infos.alcunha,
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
                      text: infos.filiacao1,
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
                      text: infos.filiacao2,
                      style: ['content']
                    }
                  ],
                  colSpan: 6,
                  border: [true, true, true, false]
                },
                {},
                {},
                {},
                {},
                {},
              ],
            ]
          }
        },
        {
          table: {
            widths: [50, 50, '*', 50, 80, 30, 70, 70],
            body: [
              [
                {
                  stack: [
                    {
                      text: 'SEXO',
                      style: 'title',
                    },
                    {
                      text: infos.sexo == 'MASCULINO' ? 'M' : 'F',
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
                      text: infos.dataDeNascimento,
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
                      text: infos.municipioNascimento,
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
                      text: infos.UFNascimento,
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
                      text: infos.estadoCivil,
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
                      text: infos.instrucao,
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
                      text: 'RG',
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
                      text: infos.numeroRG,
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
                      text: 'SSP',
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
                      text: infos.UFDocumento,
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
                      text: infos.numeroCPF,
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
                      text: infos.policial,
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
                      text: 'Brasil',
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
                      text: 'Brasileira',
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
                      text: infos.tituloEleitor,
                      style: [{ fontSize: 8, lineHeight: 0.85 }],
                    },
                  ],
                  colSpan: 2
                },
                {},
                {
                  stack: [
                    {
                      text: 'Nº DE DEPENDENTES',
                      style: 'title',
                    },
                    {
                      text: infos.dependentes,
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
                      text: infos.profissao,
                      style: ['content'],
                    },
                  ],
                  colSpan: 8,
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
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  stack: [
                    {
                      text: 'ENDEREÇO (RUA/AV)',
                      style: 'title',
                    },
                    {
                      text: infos.endereco,
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
                      text: infos.numero,
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
                      text: infos.complemento,
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
                      text: infos.bairro,
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
                      text: infos.municipioEstado,
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
                      text: infos.CEP,
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
                      text: infos.numeroTelefone,
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
                      style: 'title',
                    },
                    {
                      text: infos.vitimas,
                      style: ['content'],
                    },
                  ],
                  colSpan: 4
                }
              ],
              [
                {
                  stack: [
                    {
                      text: 'INFRAÇÃO PENAL',
                      style: 'title',
                    },
                    {
                      text: infos.infracao,
                      style: ['content'],
                    },
                  ],
                  colSpan: 4
                }
              ],
              [
                {
                  stack: [
                    {
                      text: 'Nº PROCESSO',
                      style: 'title',
                    },
                    {
                      text: infos.numeroProcesso,
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
                      text: infos.orgaoProcesso,
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
                      text: infos.situacaoProcesso,
                      style: ['content'],
                    },
                  ],
                }
              ],
              [
                {
                  stack: [
                    {
                      text: 'MANDADO DE PRISÃO',
                      style: 'title',
                    },
                    {
                      text: infos.numeroMandado,
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
                      text: infos.expedicaoMandado,
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
                      text: infos.orgaoMandado,
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
                      text: infos.situacaoMandado,
                      style: ['content'],
                    },
                  ],
                }
              ],
              [
                {
                  stack: [
                    {
                      text: 'PORTE DE ARMA',
                      style: 'title',
                    },
                    {
                      text: infos.porteArma,
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
                      text: infos.orgaoEmissorArma,
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
                      text: infos.identificacaoArma,
                      style: ['content'],
                    },
                  ],
                }
              ],
              [
                {
                  stack: [
                    {
                      text: 'OBSERVAÇÕES',
                      style: 'title',
                    },
                    {
                      text: infos.observacoes,
                      style: ['content'],
                    },
                  ],
                  colSpan: 4
                },
                {},
                {},
                {}
              ]
            ]
          }
        }
      ],
      styles: {
        title: {
          fontSize: 6,
          lineHeight: 0.85
        },
        content: {
          fontSize: 9,
          lineHeight: 0.85
        },
      }
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.open();

    return true;
  }
}
