export default class Token {
    constructor(public kind: TokenType, public content?: string) { }
}

export type TokenType = "space"
                      | "line-break"
                      | "word"
                      | "symbol"
                      | "string"
                      | "reserved word"
                      | "access modifier"
                      | "variable declaration"
                      | "import export"
                      | "object type"
                      | "switch option"
                      | "loop control flow"
                      | "value"
                      | "for iterator"
                      ;