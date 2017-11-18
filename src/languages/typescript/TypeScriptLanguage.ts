import Language from "../Language";
import LineOfCode from '../LineOfCode';
import TypeScriptScanner, { SyntaxKind } from "./TypeScriptScanner";
import TypeScriptToken, * as token from "./TypeScriptToken";
import * as tsc from "typescript";

export default class TypeScriptLanguage extends Language<TypeScriptToken> {

    private code: string;
    private position: number;
    private tokens: TypeScriptToken[];

    private endOfCode(): boolean {
        return this.position >= this.code.length;
    }

    public token2string(token: TypeScriptToken, intersectionWords: Set<string>): string
    {
        //TODO: doesn't work after changed the scanner to use the tsc API
        switch (token.kind) {
            case "symbol": return token.content || "";
            case "reserved word": return token.content || "";
            case "word": return intersectionWords.has(token.content || "") ? `${token.kind}[${token.content}]` : token.kind;
            default: return token.kind;
        }
    }

    public stringify(lines: (TypeScriptToken|undefined)[][], indentation: string, lineBreak: string): string
    {
        const stringifiedLines = lines.map(line => "");

        for (let column = 0; column < lines[0].length; column++) {
            const lengths = lines.map(l => {
                const token = l[column];
                return (token && token.content || "").length;
            });
            const maxLength = Math.max(...lengths);

            for (let i = 0; i < lines.length; i++) {
                const token = lines[i][column];
                const content = token && token.content || "";
                stringifiedLines[i] += this.pad(content, maxLength);
            }
        }

        return stringifiedLines.map(line => indentation + line).join(lineBreak);
    }

    public tokenize(lines: string[]): LineOfCode<TypeScriptToken>[]
    {
        return lines.map(line => {
            const scanner = new TypeScriptScanner(line);

            let tokens = [];

            while(!scanner.endOfLine()) {
                tokens.push(scanner.getToken());
            }

            return tokens;
        });
    }
}
