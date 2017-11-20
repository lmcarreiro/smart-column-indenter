import * as assert from 'assert';
import LanguageFactory from '../src/languages/LanguageFactory';
import TypeScriptLanguage from '../src/languages/typescript/TypeScriptLanguage';
import { SyntaxKind } from '../src/languages/typescript/TypeScriptScanner';
import Config from '../src/Config';

describe('Tokenization', () => {

    describe('TypeScript', () => {

        it('Single import', () => {
            const config = { languageExtensionsMap: { TypeScript: ["ts"] } };
            const code = [`import * as assert from 'assert';`];
            const language = <TypeScriptLanguage>LanguageFactory.getLanguage(config, "ts");

            const tokens = language.tokenize(code)[0].filter(t => t.syntaxKind !== SyntaxKind.WhitespaceTrivia);

            assert.equal(tokens.length, 7);
            assert.ok(tokens[0].syntaxKind === SyntaxKind.ImportKeyword  && tokens[0].content === "import"  );
            assert.ok(tokens[1].syntaxKind === SyntaxKind.AsteriskToken  && tokens[1].content === "*"       );
            assert.ok(tokens[2].syntaxKind === SyntaxKind.AsKeyword      && tokens[2].content === "as"      );
            assert.ok(tokens[3].syntaxKind === SyntaxKind.Identifier     && tokens[3].content === "assert"  );
            assert.ok(tokens[4].syntaxKind === SyntaxKind.FromKeyword    && tokens[4].content === "from"    );
            assert.ok(tokens[5].syntaxKind === SyntaxKind.StringLiteral  && tokens[5].content === "'assert'");
            assert.ok(tokens[6].syntaxKind === SyntaxKind.SemicolonToken && tokens[6].content === ";"       );
        });

        it('Escaped string delimiter', () => {

            const testStr = (str: string, delimiter: string, kind: SyntaxKind) => {
                const config = { languageExtensionsMap: { TypeScript: ["ts"] } };
                const strContent = delimiter + str + delimiter;
                const code = [`let str = ${strContent};`];
                const language = <TypeScriptLanguage>LanguageFactory.getLanguage(config, "ts");
                const tokens = language.tokenize(code)[0].filter(t => t.syntaxKind !== SyntaxKind.WhitespaceTrivia);

                assert.equal(tokens.length, 5);
                assert.ok(tokens[3].syntaxKind === kind && tokens[3].content === strContent);
            }

            testStr('simple single quotes string', "'", SyntaxKind.StringLiteral);
            testStr("simple double quotes string", '"', SyntaxKind.StringLiteral);
            testStr(`simple es6 template string`, "`", SyntaxKind.NoSubstitutionTemplateLiteral);

            testStr('single quotes string with "other" `quotes`', "'", SyntaxKind.StringLiteral);
            testStr("double quotes string with 'other' `quotes`", '"', SyntaxKind.StringLiteral);
            testStr(`es6 template string with 'other' "quotes"`, "`", SyntaxKind.NoSubstitutionTemplateLiteral);

            testStr('single quotes string with "other" `quotes` and the same \\\' delimiter scaped', "'", SyntaxKind.StringLiteral);
            testStr("double quotes string with 'other' `quotes` and the same \\\" delimiter scaped", '"', SyntaxKind.StringLiteral);
            testStr(`es6 template string with 'other' "quotes" and the same \\\` delimiter scaped`, "`", SyntaxKind.NoSubstitutionTemplateLiteral);
        });

    });

});
