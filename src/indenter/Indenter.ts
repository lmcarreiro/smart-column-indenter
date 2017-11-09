import * as fs from 'fs';
import * as sc from './scanner';
import LCS     from './LCS';
import Sequence from './LCS/Sequence';
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
        const scanner = sc.ScannerFactory.getScanner(this.config, extension);
        const tokens = scanner.scan(code);
        const lines = this.trimTokens(this.splitTokens(tokens)).filter(l => l.length > 0);
        const lcs = this.executeLCS(lines);

        return this.columnizeTokens(lcs, lines);
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

    private trimTokens(lines: Token[][]): Token[][] {
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].length && lines[i][0].kind === "space"                  ? lines[i].slice(1)     : lines[i];
            lines[i] = lines[i].length && lines[i][lines[i].length-1].kind === "space"  ? lines[i].slice(0, -1) : lines[i];
        }

        return lines;
    }

    private executeLCS(lines: Token[][]): Sequence
    {
        const treatedLines = this.normalizeMissingComma(lines);
        const sequences = treatedLines.map(line => line.map(token => this.token2string(token)));

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

    /**
     * Binary XOR operation with boolean (the ^ operator just works with numbers)
     */
    private xor(left: boolean, right: boolean): boolean
    {
        return !!(+left ^ +right);
    }

    private columnizeTokens(lcs: string[], lines: Token[][]): string
    {
        const columnizedLines = lines.map(line => [] as (Token|undefined)[]);
        const actualColumnByLine = lines.map(line => 0);

        for (const tokenKind of lcs) {
            let tokenWithOtherKind: boolean;

            do {
                tokenWithOtherKind = false;
                lines.forEach((line, i) => {
                    if (this.token2string(line[actualColumnByLine[i]]) !== tokenKind) {
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

        return this.stringify(columnizedLines);
    }

    private stringify(lines: (Token|undefined)[][]): string
    {
        const stringifiedLines = lines.map(line => "");

        for (let column = 0; column < lines[0].length; column++) {
            const lengths = lines.map(l => {
                const token = l[column];
                return token && token.content ? token.content.length : 0;
            });
            const maxLength = Math.max(...lengths);

            for (let i = 0; i < lines.length; i++) {
                const token = lines[i][column];
                const content = (token && token.content) || "";
                stringifiedLines[i] += this.pad(content, maxLength);
            }
        }

        //TODO: put original indentation back in the string
        //TODO: replace line-break type with the same used on input code
        return stringifiedLines.join("\r\n");
    }

    private pad(str: string, length: number, char: string = " "): string
    {
        return str + new Array((length - str.length) + 1).join(char);
    }

    private token2string(token: Token): string
    {
        switch (token.kind) {
            case "symbol": return token.content || "";
            case "reserved word": return token.content || "";
            default: return token.kind;
        }
    }
}