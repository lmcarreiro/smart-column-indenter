import Token from "../Token";

export default class XmlToken extends Token {
    constructor(kind: TokenType, content: string)
    {
        super(kind, content);
    }
}

type TokenType = "start-tag"  // <XXX
               | "end-tag"    // </XXX
               | "tag-close"  // >
               | "attribute"
               | "equal"
               | "attrivuteValue"
               | "innerContent"
               ;
