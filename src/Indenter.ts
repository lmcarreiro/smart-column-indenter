import * as fs from 'fs';
import * as sc from './scanner';
import LCS     from 'multiple-lcs/src/LCS';
import Sequence from 'multiple-lcs/src/Sequence';
import Config  from './Config';
import Token   from './Token';

export default class Indenter
{
    private config: Config;

    public constructor(config?: Config) {
        const jsonDefaultConfig = fs.readFileSync(`${__dirname}/config.json`, { encoding: "utf-8" });
        const defaultConfig: { [key: string]: any } = JSON.parse(jsonDefaultConfig);
        
        //TODO: load default config and override with parameter object
        this.config = <Config>{ ...defaultConfig, ...config };
    }

    public indent(code: string, extension: string): string
    {
        const numLines = (code.trim().match(/\r\n|\r|\n/g) || []).length + 1;
        if (numLines < 2) {
            throw new Error("The code to indent must have at least 2 lines of code.");
        }

        const lineBreak = (code.match(/\r\n|\r|\n/) || ["\n"])[0];
        const indentation = code.trim().split(/\r\n|\r|\n/g)[1].replace(/(\s+).*/, "$1");

        const scanner = sc.ScannerFactory.getScanner(this.config, extension);
        const tokens = scanner.scan(code);
        const lines = this.splitTokens(tokens).filter(l => l.length > 0);
        const intersectionWords = this.wordsIntersection(lines);
        const lcs = this.executeLCS(lines, intersectionWords);

        const indentedCode = this.columnizeTokens(lcs, lines, intersectionWords, indentation, lineBreak);

        this.ensureSameCode(code, indentedCode);

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
    
    private executeLCS(lines: Token[][], intersectionWords: Set<string>): Sequence
    {
        const treatedLines = this.normalizeMissingComma(lines);
        const sequences = treatedLines.map(line => line.map(token => this.token2string(token, intersectionWords)));

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
        return Sequence.intersection(wordsByLine);
    }

    /**
     * Binary XOR operation with boolean (the ^ operator just works with numbers)
     */
    private xor(left: boolean, right: boolean): boolean
    {
        return !!(+left ^ +right);
    }

    private columnizeTokens(lcs: string[], lines: Token[][], intersectionWords: Set<string>, indentation: string, lineBreak: string): string
    {
        const columnizedLines = lines.map(line => [] as (Token|undefined)[]);
        const actualColumnByLine = lines.map(line => 0);

        for (const lcsToken of lcs) {
            let tokenWithOtherKind: boolean;

            do {
                tokenWithOtherKind = false;
                lines.forEach((line, i) => {
                    if (this.token2string(line[actualColumnByLine[i]], intersectionWords) !== lcsToken) {
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

        return this.stringify(columnizedLines, indentation, lineBreak);
    }

    private stringify(lines: (Token|undefined)[][], indentation: string, lineBreak: string): string
    {
        const stringifiedLines = lines.map(line => "");

        for (let column = 0; column < lines[0].length; column++) {
            const lengths = lines.map(l => {
                const token = l[column];
                return this.stringifyToken(token).length;
            });
            const maxLength = Math.max(...lengths);

            for (let i = 0; i < lines.length; i++) {
                const token = lines[i][column];
                const content = this.stringifyToken(token);
                stringifiedLines[i] += this.pad(content, maxLength);
            }
        }

        return stringifiedLines.map(line => indentation + line).join(lineBreak);
    }

    private stringifyToken(token: Token|undefined): string
    {
        if (token && token.content) {
            let content = token.content;

            if (token.kind === "symbol") {
                content += " ";
            }

            return content;
        }

        return "";
    }

    private pad(str: string, length: number, char: string = " "): string
    {
        return str + new Array((length - str.length) + 1).join(char);
    }

    private token2string(token: Token, intersectionWords: Set<string>): string
    {
        switch (token.kind) {
            case "symbol": return token.content || "";
            case "reserved word": return token.content || "";
            case "word": return intersectionWords.has(token.content || "") ? `${token.kind}[${token.content}]` : token.kind;
            default: return token.kind;
        }
    }
}