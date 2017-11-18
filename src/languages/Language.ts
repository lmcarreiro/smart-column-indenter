import LineOfCode from "./LineOfCode";
import Token from "./Token";

export default abstract class Language<TokenType extends Token>
{
    protected abstract readonly headOrTailMissingToken: string|undefined;

    constructor(protected linesOfCode: string[]) { }

    public abstract tokenize(): LineOfCode<TokenType>[];

    public abstract stringify(columnizedLines: (Token|undefined)[][]): string[];

    public abstract token2string(token: TokenType): string;

    protected pad(str: string, length: number, char: string = " "): string
    {
        return str + new Array((length - str.length) + 1).join(char);
    }

    /**
     * Inside and object literal, array literal or a function parameter list where there is one item per line,
     * it's common to have a missing comma at the end of the last line (or the beginning of the first line), so
     * there is no way of this comma be part of the LCS, or if it is, it is not what we want. Then, it's best
     * to remove it before execute the LCS
     */
    public removeHeadOrTailMissingToken(lines: LineOfCode<TokenType>[]): LineOfCode<TokenType>[]
    {
        if (this.headOrTailMissingToken) {
            const allButFirstStartsWithComma = lines.every((line, i) => this.xor(line[0].content === this.headOrTailMissingToken, i === 0));
            const allButLastEndsWithComma = lines.every((line, i) => this.xor(line[line.length-1].content === this.headOrTailMissingToken, i === (lines.length-1)));

            if (allButFirstStartsWithComma) {
                return lines.map((line, i) => i === 0 ? line : line.slice(1));
            }
            else if (allButLastEndsWithComma) {
                return lines.map((line, i) => i === (lines.length-1) ? line : line.slice(0, -1));
            }
        }
        return lines;
    }

    /**
     * Binary XOR operation with boolean (the ^ operator just works with numbers)
     */
    private xor(left: boolean, right: boolean): boolean
    {
        return !!(+left ^ +right);
    }
}
