import Scanner from "./base/Scanner";
import Token, { TokenType } from "../Token";

export default class TypeScriptScanner extends Scanner {

    private code: string;
    private position: number;
    private tokens: Token[];

    private endOfCode(): boolean {
        return this.position >= this.code.length;
    }

    public scan(code: string): Token[] {
        this.code = code.trim();
        this.position = 0;
        this.tokens = [];
        
        do  {
            this.tokens.push(this.readSymbol());
        } while(!this.endOfCode());

        return this.tokens;
    }

    private readSymbol(): Token {
        while(this.code[this.position] === " ") {
            this.position++;
        }

        let nextChar = this.code[this.position];

        if (nextChar.match(/\r|\n|\r\n/)) {
            this.position++;
            return new Token("line-break");
        }
        else if (nextChar.match(/[a-zA-Z0-9_]/)) {
            let content = [];
            do {
                content.push(nextChar);
                nextChar = this.code[++this.position];
            } while(nextChar.match(/[a-zA-Z0-9_$.]/));
            return this.createWordToken(content.join(""));
        }
        else if (nextChar.match(/[\[\](){}:;,=<>!%/*+-]/)) {
            this.position++;
            return new Token("symbol", nextChar);
        }
        else if (nextChar.match(/["'`\/]/)) {
            this.position++;
            let stringDelimiter = nextChar;
            let content = [nextChar];
            let prevChar = "";
            do {
                prevChar = nextChar;
                nextChar = this.code[this.position++];
                content.push(nextChar);
            } while(nextChar !== stringDelimiter || prevChar === "\\");
            return new Token("string", content.join(""));
        }
        else {
            throw new Error("Invalid charater!");
        }
    }

    private createWordToken(content: string): Token
    {
        if (TypeScriptScanner.reservedWords.indexOf(content) > -1) {
            const type = TypeScriptScanner.reservedWordType[content] || "reserved word";
            return new Token(type, content);
        }
        else {
            return new Token("word", content);
        }
    }

    private static reservedWordType: { [word: string]: TokenType } = {
        "private": "access modifier",
        "protected": "access modifier",
        "public": "access modifier",

        "var": "variable declaration",
        "let": "variable declaration",
        "const": "variable declaration",

        "import": "import export",
        "export": "import export",

        "any": "object type",
        "boolean": "object type",
        "number": "object type",
        "string": "object type",
        "object": "object type",
        "never": "object type",
        "void": "object type",

        "case": "switch option",
        "default": "switch option",

        "break": "loop control flow",
        "continue": "loop control flow",

        "false": "value",
        "null": "value",
        "true": "value",
        "undefined": "value",

        "in": "for iterator",
        "of": "for iterator",
    }

    private static reservedWords = [
        "abstract",
        "any",
        "as",
        "boolean",
        "break",
        "case",
        "catch",
        "class",
        "continue",
        "const",
        "constructor",
        "debugger",
        "declare",
        "default",
        "delete",
        "do",
        "else",
        "enum",
        "export",
        "extends",
        "false",
        "finally",
        "for",
        "from",
        "function",
        "get",
        "if",
        "implements",
        "import",
        "in",
        "instanceof",
        "interface",
        "is",
        "keyof",
        "let",
        "module",
        "namespace",
        "never",
        "new",
        "null",
        "number",
        "object",
        "package",
        "private",
        "protected",
        "public",
        "readonly",
        "require",
        "global",
        "return",
        "set",
        "static",
        "string",
        "super",
        "switch",
        "symbol",
        "this",
        "throw",
        "true",
        "try",
        "type",
        "typeof",
        "undefined",
        "var",
        "void",
        "while",
        "with",
        "yield",
        "async",
        "await",
        "of",
    ];
}
