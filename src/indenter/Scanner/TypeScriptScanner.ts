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
        this.code = code;
        this.position = 0;
        this.tokens = [];
        
        do  {
            this.tokens.push(this.readSymbol());
        } while(!this.endOfCode());

        return this.tokens;
    }

    private readSymbol(): Token {
        let nextChar = this.code[this.position];

        if (nextChar === " ") {
            while(this.code[this.position] === " ") {
                this.position++;
            }
            return new Token("space");
        }
        else if (nextChar.match(/\r|\n|\r\n/)) {
            this.position++;
            return new Token("line-break");
        }
        else if (nextChar.match(/[a-zA-Z0-9_]/)) {
            let content = [];
            do {
                content.push(nextChar);
                nextChar = this.code[++this.position];
            } while(nextChar.match(/[a-zA-Z0-9_]/));
            return new Token("word", content.join(""));
        }
        else if (nextChar.match(/[;*]/)) {
            this.position++;
            return new Token("symbol", nextChar);
        }
        else if (nextChar.match(/["']/)) {
            this.position++;
            let stringDelimiter = nextChar;
            let content = [nextChar];
            do {
                nextChar = this.code[this.position++];
                content.push(nextChar);
            } while(nextChar !== stringDelimiter);
            return new Token("string", content.join(""));
        }
        else {
            throw new Error("Invalid charater!");
        }
    }
}