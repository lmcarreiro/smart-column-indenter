import LineOfCode from "./LineOfCode";
import Token from "./Token";

export default abstract class Language<TokenType extends Token>
{
    public abstract tokenize(lines: string[]): LineOfCode<TokenType>[];

    public abstract stringify(columnizedLines: (Token|undefined)[][], indentation: string, lineBreak: string): string;

    public abstract token2string(token: TokenType, intersectionWords: Set<string>): string;

    protected pad(str: string, length: number, char: string = " "): string
    {
        return str + new Array((length - str.length) + 1).join(char);
    }
}
