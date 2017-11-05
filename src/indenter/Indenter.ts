import * as fs from 'fs';
import * as sc from './scanner';
import LCS     from './LCS';
import Config  from './Config';
import Token   from './Token';

export default class Indenter
{
    private config: Config;

    public constructor(config: string|Config) {
        if (typeof config === "string") {
            var jsonConfig = fs.readFileSync(config, { encoding: "utf-8" });
            this.config = JSON.parse(jsonConfig);
        }
        else {
            //TODO: load default config and override with parameter object
            this.config = config;
        }
    }

    public indent(code: string, extension: string): string
    {
        const scanner = sc.ScannerFactory.getScanner(this.config, extension);
        const tokens = scanner.scan(code);
        const lines = this.trimTokens(this.splitTokens(tokens)).filter(l => l.length > 0);
        const sequences = lines.map(line => line.map(token => this.token2string(token)));

        const lcs = new LCS().execute(sequences);
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