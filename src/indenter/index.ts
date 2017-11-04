import Indenter             from "./Indenter";
import Sequence             from "./LCS/Sequence";
import RecursiveInGroupsLCS from "./LCS/RecursiveInGroupsLCS";

main();

function main() {
    try {
        testLCS();
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
    
    let code = `
        import * as assert from 'assert';
        import Indenter from '../src/indenter/Indenter';
    `;
    console.log(code);

    let indenter = new Indenter("./src/indenter/config.json");
    let indentedCode = indenter.indent(code, "ts");

    console.log("Indented code:");
    console.log(indentedCode);
}

function testLCS(): void
{
    const sequences = [
        "xaaabbbx",
        "aaaxxbbb",
        "xcccdddx",
        "cccxxddd"
    ];
    const expected = "xx";

    test(sequences, expected);
}

function test(sequences: string[], expectedLCS: string): void
{
    testWithSequences(sequences.map(str => str.split("")), expectedLCS.split(""));
}

function testWithSequences(sequences: Sequence[], expectedLCS: Sequence): void
{
    console.log("Sequences: ");
    console.log(sequences);

    let lcs = new RecursiveInGroupsLCS();
    let result = lcs.execute(sequences);

    console.log("LCS: ");
    console.log(result);
}
