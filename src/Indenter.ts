import * as fs from 'fs';
import * as assert from 'assert';
import LanguageFactory from './languages/LanguageFactory';
import Language from './languages/Language';
import Token from './languages/Token';
import LCS from 'multiple-lcs';
import Config  from './Config';
import Columnizer from './Columnizer';


export default class Indenter
{
    private code: string;
    private extension: string;
    private config: Config;

    public constructor(code: string, extension: string, config?: Config) {
        this.code = code;
        this.extension = extension;
        this.config = this.overrideDefaultConfig(config);
    }

    private overrideDefaultConfig(newConfig?: Config): Config
    {
        const jsonDefaultConfig = fs.readFileSync(`${__dirname}/config.json`, { encoding: "utf-8" });
        const defaultConfig: { [key: string]: any } = JSON.parse(jsonDefaultConfig);

        return <Config>{ ...defaultConfig, ...newConfig };
    }

    public indent(): string
    {
        const language = LanguageFactory.getLanguage(this.config, this.extension);
        const linesOfCode = this.code.split(/\r\n|\r|\n/).map(l => l.trim()).filter(l => l !== "");
        
        assert.ok(linesOfCode.length >= 2, "The code to indent must have at least 2 lines of code.");

        const linesOfTokens = language.tokenize(linesOfCode);
        const commonTokens = this.commonTokens(language, linesOfTokens);
        const columnizedTokens = new Columnizer(language, commonTokens, linesOfTokens).columnize();
        const indentedCode = this.stringify(language, columnizedTokens);

        this.ensureSameCode(this.code, indentedCode);

        return indentedCode;
    }

    private commonTokens(language: Language<Token>, linesOfTokens: Token[][]): string[]
    {
        const sequencesOfTokens = language.removeHeadOrTailMissingToken(linesOfTokens);
        const sequencesOfStrings = sequencesOfTokens.map(line => line.map(token => language.token2string(token)));
        return new LCS().execute(sequencesOfStrings);
    }

    private stringify(language: Language<Token>, columnizedTokens: (Token[])[][]): string
    {
        const spacesBefore = this.code.replace(/\S[\s\S]*/, "");
        const spacesAfter = this.code.replace(/[\s\S]*\S/, "");
        const lineBreak = (this.code.match(/\r\n|\r|\n/) || ["\n"])[0];
        const indentation = this.code.trim().split(/\r\n|\r|\n/g)[1].replace(/^(\s*).*/, "$1");

        const indentedCode = language.stringify(columnizedTokens).join(lineBreak + indentation);
        return spacesBefore + indentedCode + spacesAfter;

    }

    private ensureSameCode(code: string, indentedCode: string): void
    {
        const codeWithoutIndentation         = code        .replace(/ /g, "").replace(/\r\n|\r|\n/g, "\n").trim();
        const indentedCodeWithoutIndentation = indentedCode.replace(/ /g, "").replace(/\r\n|\r|\n/g, "\n").trim();

        if (codeWithoutIndentation !== indentedCodeWithoutIndentation) {
            throw new Error("The indentation process are trying to change the code. It is a bug, please, open an issue: https://github.com/lmcarreiro/smart-column-indenter");
        }
    }
}