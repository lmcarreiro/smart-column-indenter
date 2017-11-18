import Token from "../Token";

export default class TypeScriptToken extends Token {
    constructor(kind: string, content: string, level: number)
    {
        super(kind, content, level);
    }
}

type TokenType = "word"
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

export const reservedWordType: { [word: string]: TokenType } = {
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

export const reservedWords = [
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