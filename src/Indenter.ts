import * as fs from 'fs';
import LanguageFactory from './languages/LanguageFactory';
import Language from './languages/Language';
import Token from './languages/Token';
import LCS from 'multiple-lcs';
import intersection = require('lodash.intersection');
import Config  from './Config';

export default class Indenter
{
    private code: string;
    private extension: string;
    private config: Config;
    private language: Language<Token>;

    public constructor(code: string, extension: string, config?: Config) {
        this.code = code;
        this.extension = extension;
        this.config = this.overrideDefaultConfig(config);
        this.language = LanguageFactory.getLanguage(this.config, this.extension);
    }

    private overrideDefaultConfig(newConfig?: Config): Config
    {
        const jsonDefaultConfig = fs.readFileSync(`${__dirname}/config.json`, { encoding: "utf-8" });
        const defaultConfig: { [key: string]: any } = JSON.parse(jsonDefaultConfig);

        return <Config>{ ...defaultConfig, ...newConfig };
    }

    public indent(): string
    {
        const numLines = (this.code.trim().match(/\r\n|\r|\n/g) || []).length + 1;
        if (numLines < 2) {
            throw new Error("The code to indent must have at least 2 lines of code.");
        }

        const linesOfCode = this.code.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l !== "");
        const linesOfTokens = this.language.tokenize(linesOfCode);
        const intersectionWords = this.wordsIntersection(linesOfTokens);
        const lcs = this.executeLCS(linesOfTokens, intersectionWords);

        const lineBreak = (this.code.match(/\r\n|\r|\n/) || ["\n"])[0];
        const indentation = this.code.trim().split(/\r\n|\r|\n/g)[1].replace(/(\s+).*/, "$1");

        const columnizedTokens = this.columnizeTokens(lcs, linesOfTokens, intersectionWords, indentation, lineBreak);
        const indentedCode = this.language.stringify(columnizedTokens, indentation, lineBreak)

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

    private splitTokens(tokens: Token[]): Token[][] {
        let lines: Token[][] = [[]];

        tokens.forEach(t => {
            if (t.kind === "line-break") {
                lines.push([]);
            }
            else {
                lines[lines.length-1].push(t);
            }
        });

        return lines;
    }

    private executeLCS(lines: Token[][], intersectionWords: Set<string>): string[]
    {
        const treatedLines = this.normalizeMissingComma(lines);
        const sequences = treatedLines.map(line => line.map(token => this.language.token2string(token, intersectionWords)));

        return new LCS().execute(sequences);
    }

    /**
     * Inside and object literal, array literal or a function parameter list where there is one item per line,
     * it's common to have a missing comma at the end of the last line (or the beginning of the first line), so
     * there is no way of this comma be part of the LCS, or if it is, it is not what we want. Then, it's best
     * to remove it before execute the LCS
     */
    private normalizeMissingComma(lines: Token[][]): Token[][]
    {
        const allButFirstStartsWithComma = lines.every((line, i) => this.xor(line[0].content === ",", i === 0));
        const allButLastEndsWithComma = lines.every((line, i) => this.xor(line[line.length-1].content === ",", i === (lines.length-1)));

        if (allButFirstStartsWithComma) {
            return lines.map((line, i) => i === 0 ? line : line.slice(1));
        }
        else if (allButLastEndsWithComma) {
            return lines.map((line, i) => i === (lines.length-1) ? line : line.slice(0, -1));
        }
        else {
            return lines;
        }
    }

    private wordsIntersection(lines: Token[][]): Set<string>
    {
        const wordsByLine = lines.map(line => line.filter(t => t.kind === "word").map(t => t.content || ""));
        return new Set(intersection(...wordsByLine));
    }

    /**
     * Binary XOR operation with boolean (the ^ operator just works with numbers)
     */
    private xor(left: boolean, right: boolean): boolean
    {
        return !!(+left ^ +right);
    }

    private columnizeTokens(lcs: string[], lines: Token[][], intersectionWords: Set<string>, indentation: string, lineBreak: string): (Token|undefined)[][]
    {
        const columnizedLines = lines.map(line => [] as (Token|undefined)[]);
        const actualColumnByLine = lines.map(line => 0);

        for (const lcsToken of lcs) {
            let tokenWithOtherKind: boolean;

            do {
                tokenWithOtherKind = false;
                lines.forEach((line, i) => {
                    if (this.language.token2string(line[actualColumnByLine[i]], intersectionWords) !== lcsToken) {
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