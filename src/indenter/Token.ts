export default class Token {
    constructor(public kind: TokenType, public content?: string) { }
}

export type TokenType = "space"|"line-break"|"word"|"symbol"|"string";