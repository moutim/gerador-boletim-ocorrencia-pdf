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
    const brasaoCivil = './brasao-civil.png';

    const docDefinition = {
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
            widths: [80, '*', 80, 80],
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
                },
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
            ]
          }
        },
        {
          table: {
            widths: ['*', 40, 80, 80, 80],
            body: [
              [
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
                      text: '27/03/2024',
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
                      text: '05/04/2024',
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
                      text: '26/04/2024',
                      style: ['content'],
                    },
                  ],
                },
              ],
            ]
          }
        },
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
