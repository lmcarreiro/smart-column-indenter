import * as fs from 'fs';
import * as assert from 'assert';
import LanguageFactory from './languages/LanguageFactory';
import Language from './languages/Language';
import Token from './languages/Token';
import LCS from 'multiple-lcs';
import Config  from './Config';

export default class Indenter
{
    private code: string;
    private language: Language<Token>;

    public constructor(code: string, extension: string, config?: Config) {
        const completeConfig = this.overrideDefaultConfig(config);
        
        const linesOfCode = code.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l !== "");
        assert.ok(linesOfCode.length >= 2, "The code to indent must have at least 2 lines of code.");

        this.code = code;
        this.language = LanguageFactory.getLanguage(completeConfig, extension, linesOfCode);
    }

    private overrideDefaultConfig(newConfig?: Config): Config
    {
        const jsonDefaultConfig = fs.readFileSync(`${__dirname}/config.json`, { encoding: "utf-8" });
        const defaultConfig: { [key: string]: any } = JSON.parse(jsonDefaultConfig);

        return <Config>{ ...defaultConfig, ...newConfig };
    }

    public indent(): string
    {
        const linesOfTokens = this.language.tokenize();

        const sequences = this.language.removeHeadOrTailMissingToken(linesOfTokens)
            .map(line => line.map(token => this.language.token2string(token)));
        const lcs = new LCS().execute(sequences);

        const columnizedTokens = this.columnizeTokens(lcs, linesOfTokens);

        const spacesBefore = this.code.replace(/\S[\s\S]*/, "");
        const spacesAfter = this.code.replace(/[\s\S]*\S/, "");
        const lineBreak = (this.code.match(/\r\n|\r|\n/) || ["\n"])[0];
        const indentation = this.code.trim().split(/\r\n|\r|\n/g)[1].replace(/(\s+).*/, "$1");

        let indentedCode = this.language.stringify(columnizedTokens).join(lineBreak + indentation);
        indentedCode = spacesBefore + indentedCode + spacesAfter;

        this.ensureSameCode(this.code, indentedCode);

        return indentedCode;
    }

    private ensureSameCode(code: string, indentedCode: string): void
    {
        const codeWithoutIndentation         = code        .replace(/ /g, "").replace(/\r\n|\r|\n/g, "\n").trim();
        const indentedCodeWithoutIndentation = indentedCode.replace(/ /g, "").replace(/\r\n|\r|\n/g, "\n").trim();

        if (codeWithoutIndentation !== indentedCodeWithoutIndentation) {
            throw new Error("The indentation process are trying to change the code. It is a bug, please, open an issue: https://github.com/lmcarreiro/smart-column-indenter");
        }
    }

    private columnizeTokens(lcs: string[], lines: Token[][]): (Token|undefined)[][]
    {
        const columnizedLines = lines.map(line => [] as (Token|undefined)[]);
        const actualColumnByLine = lines.map(line => 0);

        for (const lcsToken of lcs) {
            let tokenWithOtherKind: boolean;

            do {
                tokenWithOtherKind = false;
                lines.forEach((line, i) => {
                    if (this.language.token2string(line[actualColumnByLine[i]]) !== lcsToken) {
                        tokenWithOtherKind = true;
                        columnizedLines[i].push(line[actualColumnByLine[i]]);
                        actualColumnByLine[i]++;
                    }
                    else {
                        columnizedLines[i].push(undefined);
                    }
                });
            } while(tokenWithOtherKind);

            lines.forEach((line, i) => {
                columnizedLines[i].push(line[actualColumnByLine[i]]);
                actualColumnByLine[i]++;
            });
        }

        while (lines.some((line, i) => actualColumnByLine[i] < line.length)) {
            lines.forEach((line, i) => {
                columnizedLines[i].push(actualColumnByLine[i] < line.length ? line[actualColumnByLine[i]++] : undefined);
            });
        }

        return columnizedLines;
    }
}