import * as fs from 'fs';
import * as sc from './scanner';
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
        let scanner = sc.ScannerFactory.getScanner(this.config, extension);
        let tokens = scanner.scan(code);
        let lines = this.trimTokens(this.splitTokens(tokens)).filter(l => l.length > 0);

        console.log(lines);

        this.simpleHorizontalDiff(lines);

        return code;
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

    private simpleHorizontalDiff(lines: Token[][]) {
        let linesIndented: (Token|undefined)[][] = lines.map(l => []);

        let actualColumnByLine = lines.map(l => 0);

        for (let j = 0; true; j++) {
            let values = this.valuesByKind(lines, actualColumnByLine);
            let keyMax = this.getKeyWithMaxValue(values);

            if (!keyMax) break;

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                var col = actualColumnByLine[i];

                if (line) {
                    if (line[col] && line[col].kind === keyMax) {
                        linesIndented[i].push(line[col]);
                        actualColumnByLine[i]++;
                    }
                    else {
                        linesIndented[i].push(undefined);
                    }
                }
            }
        }

        console.log("linesIndented");
        console.log(linesIndented);
    }

    private valuesByKind(lines: Token[][], actualColumnByLine: number[]): { [value: string]: number } {
        let values: { [value: string]: number } = {};
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            var col = actualColumnByLine[i];
            if (line[col]) {
                values[line[col].kind] = values[line[col].kind] || 0;
                values[line[col].kind]++;
            }
        }

        return values;
    }

    private getKeyWithMaxValue(values: { [value: string]: number }): string|undefined {
        let keyMax: string|undefined;
        let valueMax = 0;

        for(let key in values) {
            if (values[key] > valueMax) {
                keyMax = key;
                valueMax = values[key];
            }
        }

        return keyMax;
    }
}