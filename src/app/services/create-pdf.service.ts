import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import images from '../../assets/images-pdf';

@Injectable({
  providedIn: 'root'
})
export class CreatePdfService {
  constructor() { }

  createPDF() {
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
                      text: 'CRM',
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
                      text: '101º DP',
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
                      text: '1234',
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
                      text: 'SIM',
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
                      text: 'GRAJAS',
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
                      text: 'SP',
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
                      text: '28/03/2024',
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
                      text: '28/03/2024',
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
                      text: '28/03/2024',
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
                      text: 'VITOR HUGO MOUTIM',
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
                      text: 'MOUTIM',
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
                      text: 'SILVA HUGO MOUTIM',
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
                      text: 'MOUTIM HUGO VITOR',
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
                      text: 'Masculino',
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
                      text: '22/05/2001',
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
                      text: 'Interlagos',
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
                      text: 'SP',
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
                      text: 'Casado',
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
                      text: 'Superior',
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
                      text: '53182455-X',
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
                      text: 'SP',
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
                      text: '51225511895',
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
                      text: 'CIVIL',
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
                      text: '1112223334/777/999',
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
                      text: '1',
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
                      text: 'Engenheiro de Software Junior',
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
                      text: 'Rua Affonso Paulillo',
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
                      text: '14',
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
                      text: 'C',
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
                      text: 'Jardim Eliana',
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
                      text: 'Grajaú',
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
                      text: '04851-250',
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
                      text: '(11) 99818-1280',
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
                      text: 'HUGO VITOR SILVA',
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
                      text: 'Art. 157 - Subtrair coisa móvel alheia, para si ou para outrem, mediante grave ameaça ou violência a pessoa, ou depois de havê-la, por qualquer meio, reduzido à impossibilidade de resistência.',
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
                      text: '12345',
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
                      text: '777º VARA CRIMINAL DE SÃO PAULO',
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
                      text: 'Em Andamento',
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
                      text: 'MANDAD157777',
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
                      text: '28/03/2024',
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
                      text: '77ª VARA CRIMINAL BARRA FUNDA',
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
                      text: 'ENCERRADO',
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
                      text: '147528963',
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
                      text: 'SSP - SP',
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
                      text: '18/08/2023',
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
                      text: 'Observações sobre o gerador de ficha criminal',
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
  }
}
