import Indenter from "./Indenter";

try {
    console.log("Code to indent:");

    let code = `
        import * as assert from 'assert';
        import Indenter from '../src/indenter/Indenter';
    `;
    console.log(code);

    let indenter = new Indenter("./src/indenter/config.json");
    let indentedCode = indenter.indent(code);

    console.log("Indented code:");
    console.log(indentedCode);
}
catch (error) {
    console.log("\x1b[31m", `\n\n  Error: ${error}\n\n`);
    process.exit(1);
}
