import Language from "../Language";
import LineOfCode from '../LineOfCode';
import TypeScriptScanner, { SyntaxKind, nestableKinds } from "./TypeScriptScanner";
import TypeScriptToken, * as token from "./TypeScriptToken";
import * as tsc from "typescript";
import intersection = require('lodash.intersection');

export default class TypeScriptLanguage extends Language<TypeScriptToken>
{
    private wordsIntersection: Set<string>;

    public token2string(token: TypeScriptToken): string
    {
        if (nestableKinds.some(t => t[0] === token.syntaxKind || t[1] === token.syntaxKind)) {
            return `${token.content}[${token.level}]`;
        }
        else if (SyntaxKind.FirstPunctuation <= token.syntaxKind && token.syntaxKind <= SyntaxKind.LastPunctuation) {
            return token.content;
        }
        else if (SyntaxKind.FirstLiteralToken <= token.syntaxKind && token.syntaxKind <= SyntaxKind.LastLiteralToken) {
            return token.kind;
        }
        else if (token.syntaxKind === SyntaxKind.Identifier) {
            return this.wordsIntersection.has(token.content || "") ? `${token.kind}[${token.content}]` : token.kind;
        }
        else {
            return token.content;
        }
    }

    public stringify(lines: (TypeScriptToken|undefined)[][]): string[]
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

        return stringifiedLines;
    }

    public tokenize(): LineOfCode<TypeScriptToken>[]
    {
        let linesOfTokens = this.linesOfCode.map(line => {
            const scanner = new TypeScriptScanner(line);
            const tokens = [];

            while(!scanner.endOfLine()) {
                tokens.push(scanner.getToken());
            }

            return tokens;
        });

        linesOfTokens = this.removeHeadOrTailMissingToken(linesOfTokens, ",");

        const wordsByLine = linesOfTokens.map(line => line.filter(t => t.syntaxKind === SyntaxKind.Identifier).map(t => t.content));
        this.wordsIntersection = new Set(intersection(...wordsByLine))

        return linesOfTokens;
    }
}
