import Indenter from "../src/Indenter";

main();

function main() {
    try {
        testIndenter();
    }
    catch (error) {
        console.log("\x1b[31m", `\n\n  Error: ${error}\n\n`);
        process.exit(1);
    }
}

function testIndenter(): void
{
    console.log("Code to indent:");
    
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
    console.log(code);

    let indenter = new Indenter(code, "ts");

    let indentedCode2 = indenter.indent("2");
    console.log("Indented code (2):");
    console.log(indentedCode2);

    let indentedCodeN = indenter.indent("N");
    console.log("Indented code (N):");
    console.log(indentedCodeN);
}
