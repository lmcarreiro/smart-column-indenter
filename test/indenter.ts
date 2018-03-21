import * as assert from 'assert';
import Indenter from '../src/Indenter';
import Config from '../src/Config';

function test(type: "2"|"N", extension: string, code: string, expected: string, config?: Config): void
{
    const result = indent(type, extension, code, config);
    assert.equal(result, expected, "The indentation is different than the expected.");
}

function indent(type: "2"|"N", extension: string, code: string, config?: Config): string
{
    return new Indenter(code, extension, config).indent(type);
}

describe('Indenter', () => {

    describe('indent("N")', () => {

        it('one line error', () => {
            const code = `
            import Indenter from '../src/Indenter';
            `;

            try {
                indent("N", "ts", code);
                assert.fail("The code to be indented must have at least 2 lines of code");
            }
            catch {
                assert.ok(true);
            }
        });

        it('import (without indentation)', () => {
            const code = `
import Indenter from '../src/Indenter';
import Token from '../src/Token';
`;

            const expected = `
import Indenter from '../src/Indenter';
import Token    from '../src/Token'   ;
`;

            test("N", "ts", code, expected);
        });

        it('import (without indentation and spaces before/after)', () => {
            const code = `import Indenter from '../src/Indenter';\r\nimport Token from '../src/Token';`;
            const expected = `import Indenter from '../src/Indenter';\r\nimport Token    from '../src/Token'   ;`;

            test("N", "ts", code, expected);
        });

        it('import * as <identifier> vs import <identifier>', () => {
            const code = `
                import * as assert from 'assert';
                import Indenter from '../src/Indenter';
            `;

            const expected = `
                import * as assert   from 'assert'         ;
                import      Indenter from '../src/Indenter';
            `;

            test("N", "ts", code, expected);
        });


        it('with /regex/ literal', () => {
            const code = `
                const codeWithoutIndentation = code.replace(/ /g, "").replace(/\\r\\n|\\r|\\n/g, "\\n").trim();
                const indentedCodeWithoutIndentation = indentedCode.replace(/ /g, "").replace(/\\r\\n|\\r|\\n/g, "\\n").trim();
            `;

            const expected = `
                const codeWithoutIndentation         = code        .replace(/ /g, "").replace(/\\r\\n|\\r|\\n/g, "\\n").trim();
                const indentedCodeWithoutIndentation = indentedCode.replace(/ /g, "").replace(/\\r\\n|\\r|\\n/g, "\\n").trim();
            `;

            test("N", "ts", code, expected);
        });

        it('import <identifier> from "path" vs import <identifier> = require("path")', () => {
            const code = `
                import Config  from './Config';
                import Columnizer from './Columnizer';
                import intersection = require('lodash.intersection');
            `;

            const expected = `
                import Config       from      './Config'            ;
                import Columnizer   from      './Columnizer'        ;
                import intersection = require('lodash.intersection');
            `;

            test("N", "ts", code, expected);
        });

        it('some small object literals with trailing spaces', () => {
            const code = `
                {name:'id',index:'id', width:55},
                {name:'invdate',index:'invdate', width:90},
                {name:'name',index:'name asc, invdate', width:100},
                {name:'amount',index:'amount', width:80, align:"right"},  
                {name:'tax',index:'tax', width:80, align:"right"},		
                {name:'total',index:'total', width:80, align:"right"},		
                {name:'note',index:'note', width:150, sortable:false}
            `;

            const expected = `
                {name:'id'     ,index:'id'               , width:55                 },
                {name:'invdate',index:'invdate'          , width:90                 },
                {name:'name'   ,index:'name asc, invdate', width:100                },
                {name:'amount' ,index:'amount'           , width:80 , align:"right" },
                {name:'tax'    ,index:'tax'              , width:80 , align:"right" },
                {name:'total'  ,index:'total'            , width:80 , align:"right" },
                {name:'note'   ,index:'note'             , width:150, sortable:false}
            `;

            test("N", "ts", code, expected);
        });

        it('a lot of big object literals', () => {
            const code = `
                { label: 'Descrição', name: 'Nome', width: 200, align: 'left', hidden: false, editable: true, edittype: 'text' },
                { label: 'Unidade de&nbsp;Medida', name: 'UnidadeMedida', width: 100, align: 'left', hidden: modOuMoi, editable: false, edittype: 'text' },
                { label: 'Qtd.<br/>Insumo*', name: 'QuantidadeInsumo', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                { label: 'Qtd.<br/>Auxiliar*', name: 'QuantidadeAuxiliar', width: 100, align: 'right', hidden: modOuMoi, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                { label: 'Cronograma*', name: 'Cronograma', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesCron } },
                { label: 'Regime&nbsp;de Trabalho*', name: 'Regime', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesReg } },
                { label: 'Fator Multiplicador*', name: 'FatorMultiplicador', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "8", class: 'decimal' } },
                { label: 'Fator Mês*', name: 'FatorMes', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter2c },
                { label: 'Total&nbsp;Impedimento<br/>(%)*', name: 'TotalImpedimento', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter4c },
                { label: 'Encargos&nbsp;Sociais<br/>(%)*', name: 'EncargosSociais', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                { label: labelValorUnitario, name: 'ValorUnitario', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter2c, editoptions: { maxlength: "14", class: 'decimal11_2' } },
                { label: 'Salário<br/>(R$)', name: 'Salario', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                { label: 'Valor&nbsp;Total<br/>(R$)', name: 'ValorTotal', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                { label: 'Estimativa', name: 'Estimativa', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' },
                { label: 'Unidade de Medida (hint)', name: 'UnidadeMedidaDescricao', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' }
            `;
            
            const expected = `
                { label: 'Descrição'                      , name: 'Nome'                  , width: 200, align: 'left' , hidden: false    , editable: true    , edittype: 'text'                                                                                                            },
                { label: 'Unidade de&nbsp;Medida'         , name: 'UnidadeMedida'         , width: 100, align: 'left' , hidden: modOuMoi , editable: false   , edittype: 'text'                                                                                                            },
                { label: 'Qtd.<br/>Insumo*'               , name: 'QuantidadeInsumo'      , width: 100, align: 'right', hidden: false    , editable: true    , edittype: 'text'  , formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' }     },
                { label: 'Qtd.<br/>Auxiliar*'             , name: 'QuantidadeAuxiliar'    , width: 100, align: 'right', hidden: modOuMoi , editable: true    , edittype: 'text'  , formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' }     },
                { label: 'Cronograma*'                    , name: 'Cronograma'            , width: 100, align: 'left' , hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesCron }                                                 },
                { label: 'Regime&nbsp;de Trabalho*'       , name: 'Regime'                , width: 100, align: 'left' , hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesReg }                                                  },
                { label: 'Fator Multiplicador*'           , name: 'FatorMultiplicador'    , width: 100, align: 'right', hidden: false    , editable: true    , edittype: 'text'  , formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "8", class: 'decimal' }      },
                { label: 'Fator Mês*'                     , name: 'FatorMes'              , width: 100, align: 'right', hidden: !modOuMoi, editable: false   , edittype: 'text'  , formatter: 'number', formatoptions: formatter2c                                                         },
                { label: 'Total&nbsp;Impedimento<br/>(%)*', name: 'TotalImpedimento'      , width: 100, align: 'right', hidden: false    , editable: false   , edittype: 'text'  , formatter: 'number', formatoptions: formatter4c                                                         },
                { label: 'Encargos&nbsp;Sociais<br/>(%)*' , name: 'EncargosSociais'       , width: 100, align: 'right', hidden: !modOuMoi, editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                           },
                { label: labelValorUnitario               , name: 'ValorUnitario'         , width: 100, align: 'right', hidden: false    , editable: true    , edittype: 'text'  , formatter: 'number', formatoptions: formatter2c, editoptions: { maxlength: "14", class: 'decimal11_2' } },
                { label: 'Salário<br/>(R$)'               , name: 'Salario'               , width: 100, align: 'right', hidden: !modOuMoi, editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                           },
                { label: 'Valor&nbsp;Total<br/>(R$)'      , name: 'ValorTotal'            , width: 100, align: 'right', hidden: false    , editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                           },
                { label: 'Estimativa'                     , name: 'Estimativa'            , width: 100, align: 'left' , hidden: true     , editable: false   , edittype: 'text'                                                                                                            },
                { label: 'Unidade de Medida (hint)'       , name: 'UnidadeMedidaDescricao', width: 100, align: 'left' , hidden: true     , editable: false   , edittype: 'text'                                                                                                            }
            `

            /* //Maybe in the future it can indent like this:
            const expected = `
                { label: 'Descrição'                      , name: 'Nome'                  , width: 200, align: 'left' , hidden: false     , editable: true    , edittype: 'text'                                                                                                                  },
                { label: 'Unidade de&nbsp;Medida'         , name: 'UnidadeMedida'         , width: 100, align: 'left' , hidden: modOuMoi  , editable: false   , edittype: 'text'                                                                                                                  },
                { label: 'Qtd.<br/>Insumo*'               , name: 'QuantidadeInsumo'      , width: 100, align: 'right', hidden: false     , editable: true    , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal'     } },
                { label: 'Qtd.<br/>Auxiliar*'             , name: 'QuantidadeAuxiliar'    , width: 100, align: 'right', hidden: modOuMoi  , editable: true    , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal'     } },
                { label: 'Cronograma*'                    , name: 'Cronograma'            , width: 100, align: 'left' , hidden: !modOuMoi , editable: modOuMoi, edittype: 'select', formatter: 'select'      ,                             editoptions: { value: valuesCron                     } },
                { label: 'Regime&nbsp;de Trabalho*'       , name: 'Regime'                , width: 100, align: 'left' , hidden: !modOuMoi , editable: modOuMoi, edittype: 'select', formatter: 'select'      ,                             editoptions: { value: valuesReg                      } },
                { label: 'Fator Multiplicador*'           , name: 'FatorMultiplicador'    , width: 100, align: 'right', hidden: false     , editable: true    , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter4c, editoptions: { maxlength: "8" , class: 'decimal'     } },
                { label: 'Fator Mês*'                     , name: 'FatorMes'              , width: 100, align: 'right', hidden: !modOuMoi , editable: false   , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter2c                                                         },
                { label: 'Total&nbsp;Impedimento<br/>(%)*', name: 'TotalImpedimento'      , width: 100, align: 'right', hidden: false     , editable: false   , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter4c                                                         },
                { label: 'Encargos&nbsp;Sociais<br/>(%)*' , name: 'EncargosSociais'       , width: 100, align: 'right', hidden: !modOuMoi , editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                                 },
                { label: labelValorUnitario               , name: 'ValorUnitario'         , width: 100, align: 'right', hidden: false     , editable: true    , edittype: 'text'  , formatter: 'number'      , formatoptions: formatter2c, editoptions: { maxlength: "14", class: 'decimal11_2' } },
                { label: 'Salário<br/>(R$)'               , name: 'Salario'               , width: 100, align: 'right', hidden: !modOuMoi , editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                                 },
                { label: 'Valor&nbsp;Total<br/>(R$)'      , name: 'ValorTotal'            , width: 100, align: 'right', hidden: false     , editable: false   , edittype: 'text'  , formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula                                 },
                { label: 'Estimativa'                     , name: 'Estimativa'            , width: 100, align: 'left' , hidden: true      , editable: false   , edittype: 'text'                                                                                                                  },
                { label: 'Unidade de Medida (hint)'       , name: 'UnidadeMedidaDescricao', width: 100, align: 'left' , hidden: true      , editable: false   , edittype: 'text'                                                                                                                  }
            `;
            */

            test("N", "js", code, expected);
        });

    });


    describe('indent("2")', () => {
        it('key-value with comma at the beginning', () => {
            const code = `
                key1: "string s"
                , key2: <string>("1").toString()
                , k3: "key" + "3"
                , keyFour: "k" + "e" + \`y\${4}\`
            `;

            const expected = `
                  key1   : "string s"
                , key2   : <string>("1").toString()
                , k3     : "key" + "3"
                , keyFour: "k" + "e" + \`y\${4}\`
            `;

            test("2", "ts", code, expected);
        });


        it('key-value with comma at the end', () => {
            const code = `
                key1: "string s",
                key2: <string>("1").toString(),
                k3: "key" + "3",
                keyFour: "k" + "e" + \`y\${4}\`
            `;

            const expected = `
                key1   : "string s",
                key2   : <string>("1").toString(),
                k3     : "key" + "3",
                keyFour: "k" + "e" + \`y\${4}\`
            `;

            test("2", "ts", code, expected);
        });

        it('key-value with a lot of big object literals as values', () => {
            const code = `
                key: { label: 'Descrição', name: 'Nome', width: 200, align: 'left', hidden: false, editable: true, edittype: 'text' },
                , key2: { label: 'Unidade de&nbsp;Medida', name: 'UnidadeMedida', width: 100, align: 'left', hidden: modOuMoi, editable: false, edittype: 'text' },
                , key23452345: { label: 'Qtd.<br/>Insumo*', name: 'QuantidadeInsumo', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                , k: { label: 'Qtd.<br/>Auxiliar*', name: 'QuantidadeAuxiliar', width: 100, align: 'right', hidden: modOuMoi, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                , key345: { label: 'Cronograma*', name: 'Cronograma', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesCron } },
                , key32: { label: 'Regime&nbsp;de Trabalho*', name: 'Regime', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesReg } },
                , key34563457548747567: { label: 'Fator Multiplicador*', name: 'FatorMultiplicador', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "8", class: 'decimal' } },
                , key4576: { label: 'Fator Mês*', name: 'FatorMes', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter2c },
                , key56: { label: 'Total&nbsp;Impedimento<br/>(%)*', name: 'TotalImpedimento', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter4c },
                , key7: { label: 'Encargos&nbsp;Sociais<br/>(%)*', name: 'EncargosSociais', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key7657: { label: labelValorUnitario, name: 'ValorUnitario', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter2c, editoptions: { maxlength: "14", class: 'decimal11_2' } },
                , key66: { label: 'Salário<br/>(R$)', name: 'Salario', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key124: { label: 'Valor&nbsp;Total<br/>(R$)', name: 'ValorTotal', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key0976987: { label: 'Estimativa', name: 'Estimativa', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' },
                , key3: { label: 'Unidade de Medida (hint)', name: 'UnidadeMedidaDescricao', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' }
            `;
            
            const expected = `
                  key                 : { label: 'Descrição', name: 'Nome', width: 200, align: 'left', hidden: false, editable: true, edittype: 'text' },
                , key2                : { label: 'Unidade de&nbsp;Medida', name: 'UnidadeMedida', width: 100, align: 'left', hidden: modOuMoi, editable: false, edittype: 'text' },
                , key23452345         : { label: 'Qtd.<br/>Insumo*', name: 'QuantidadeInsumo', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                , k                   : { label: 'Qtd.<br/>Auxiliar*', name: 'QuantidadeAuxiliar', width: 100, align: 'right', hidden: modOuMoi, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "14", class: 'decimal' } },
                , key345              : { label: 'Cronograma*', name: 'Cronograma', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesCron } },
                , key32               : { label: 'Regime&nbsp;de Trabalho*', name: 'Regime', width: 100, align: 'left', hidden: !modOuMoi, editable: modOuMoi, edittype: 'select', formatter: 'select', editoptions: { value: valuesReg } },
                , key34563457548747567: { label: 'Fator Multiplicador*', name: 'FatorMultiplicador', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter4c, editoptions: { maxlength: "8", class: 'decimal' } },
                , key4576             : { label: 'Fator Mês*', name: 'FatorMes', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter2c },
                , key56               : { label: 'Total&nbsp;Impedimento<br/>(%)*', name: 'TotalImpedimento', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: 'number', formatoptions: formatter4c },
                , key7                : { label: 'Encargos&nbsp;Sociais<br/>(%)*', name: 'EncargosSociais', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key7657             : { label: labelValorUnitario, name: 'ValorUnitario', width: 100, align: 'right', hidden: false, editable: true, edittype: 'text', formatter: 'number', formatoptions: formatter2c, editoptions: { maxlength: "14", class: 'decimal11_2' } },
                , key66               : { label: 'Salário<br/>(R$)', name: 'Salario', width: 100, align: 'right', hidden: !modOuMoi, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key124              : { label: 'Valor&nbsp;Total<br/>(R$)', name: 'ValorTotal', width: 100, align: 'right', hidden: false, editable: false, edittype: 'text', formatter: formatFormulaI, formatoptions: formatter2c, sorttype: orderFormula },
                , key0976987          : { label: 'Estimativa', name: 'Estimativa', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' },
                , key3                : { label: 'Unidade de Medida (hint)', name: 'UnidadeMedidaDescricao', width: 100, align: 'left', hidden: true, editable: false, edittype: 'text' }
            `

            test("2", "js", code, expected);
        });

    });
});
