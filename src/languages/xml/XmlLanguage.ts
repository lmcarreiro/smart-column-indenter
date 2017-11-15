import Language from "../Language";
import LineOfCode from '../LineOfCode';
import XmlToken from './XmlToken';

export default class XmlLanguage extends Language<XmlToken> {

    public stringify(columnizedLines: (XmlToken|undefined)[][], indentation: string, lineBreak: string): string
    {
        throw new Error("Method not implemented.");
    }

    public token2string(token: XmlToken, intersectionWords: Set<string>): string
    {
        throw new Error("Method not implemented.");
    }

    public tokenize(lines: string[]): LineOfCode<XmlToken>[]
    {
        throw new Error("Method not implemented.");
    }
}
