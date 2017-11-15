export default abstract class Token
{
    public kind: TokenType;
    public content: string;

    constructor(kind: TokenType, content: string)
    {
        this.kind = kind;
        this.content = content;
    }
}

type TokenType = string;
