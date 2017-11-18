import TypeScriptToken from "./TypeScriptToken";
import {
    createScanner,
    Scanner,
    ScriptTarget,
    LanguageVariant,
    SyntaxKind
} from "typescript";

let nestableKinds: [SyntaxKind, SyntaxKind][] = [
    [SyntaxKind.OpenParenToken,   SyntaxKind.CloseParenToken  ],
    [SyntaxKind.OpenBracketToken, SyntaxKind.CloseBracketToken],
    [SyntaxKind.OpenBraceToken,   SyntaxKind.CloseBraceToken  ],
    [SyntaxKind.TemplateHead,     SyntaxKind.TemplateTail     ],
];

export { SyntaxKind };

export default class TypeScriptScanner
{
    private states: any[];
    private tscScanner: Scanner;
    private lineOfcode: string;

    public constructor(lineOfcode: string)
    {
        this.states = [];
        this.tscScanner = createScanner(ScriptTarget.ES2017, false, LanguageVariant.Standard);
        this.lineOfcode = lineOfcode;

        this.tscScanner.setText(this.lineOfcode);
        
        let tokens = [];

    }

    public getToken(): TypeScriptToken
    {
        this.tscScanner.scan();

        let token = this.tscScanner.getToken();
        let level = this.states.length;

        //TODO: handle regex token

        if (nestableKinds.some(k => token === k[0])) {
            this.states.push(token);
        }
        else if (nestableKinds.some(k => token === k[1])) {
            const state = this.states[this.states.length - 1];

            if (state === SyntaxKind.TemplateHead && token === SyntaxKind.CloseBraceToken) {
                token = this.tscScanner.reScanTemplateToken();
            }

            if (nestableKinds.some(k => state === k[0] && token === k[1])) {
                this.states.pop();
                level--;
            }
        }
        
        return new TypeScriptToken(this.getSyntaxKindName(token), this.tscScanner.getTokenText(), level);
    }

    public endOfLine(): boolean
    {
        return this.tscScanner.getTextPos() === this.lineOfcode.length;
    }

    private getSyntaxKindName(kind: SyntaxKind): string
    {
        const markers: { [name: string]: string } = {
            FirstAssignment         : "EqualsToken",
            LastAssignment          : "CaretEqualsToken",
            FirstCompoundAssignment : "PlusEqualsToken",
            LastCompoundAssignment  : "CaretEqualsToken",
            FirstReservedWord       : "BreakKeyword",
            LastReservedWord        : "WithKeyword",
            FirstKeyword            : "BreakKeyword",
            LastKeyword             : "OfKeyword",
            FirstFutureReservedWord : "ImplementsKeyword",
            LastFutureReservedWord  : "YieldKeyword",
            FirstTypeNode           : "TypePredicate",
            LastTypeNode            : "LiteralType",
            FirstPunctuation        : "OpenBraceToken",
            LastPunctuation         : "CaretEqualsToken",
            FirstToken              : "Unknown",
            LastToken               : "LastKeyword",
            FirstTriviaToken        : "SingleLineCommentTrivia",
            LastTriviaToken         : "ConflictMarkerTrivia",
            FirstLiteralToken       : "NumericLiteral",
            LastLiteralToken        : "NoSubstitutionTemplateLiteral",
            FirstTemplateToken      : "NoSubstitutionTemplateLiteral",
            LastTemplateToken       : "TemplateTail",
            FirstBinaryOperator     : "LessThanToken",
            LastBinaryOperator      : "CaretEqualsToken",
            FirstNode               : "QualifiedName",
            FirstJSDocNode          : "JSDocTypeExpression",
            LastJSDocNode           : "JSDocPropertyTag",
            FirstJSDocTagNode       : "JSDocTag",
            LastJSDocTagNode        : "JSDocPropertyTag",
            FirstContextualKeyword  : "AbstractKeyword",
            LastContextualKeyword   : "OfKeyword",
        };

        const name = SyntaxKind[kind];
        return markers.hasOwnProperty(name) ? markers[name] : name;
    }
}