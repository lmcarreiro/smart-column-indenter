import Config from "../Config";
import Language from "./Language";
import Token from "./Token";

import TypeScriptLanguage from "./typescript/TypeScriptLanguage";
import XmlLanguage from "./xml/XmlLanguage";

export default class LanguageFactory
{
    public static getLanguage(config: Config, extension: string, linesOfCode: string[]): Language<Token>
    {
        const name = LanguageFactory.getLanguageName(config, extension);

        switch (name) {
            case "TypeScript": return new TypeScriptLanguage(linesOfCode);
            case "Xml": return new XmlLanguage(linesOfCode);
            default: throw new Error(`Language '${name}' doesn't exist.`);
        }
    }

    private static getLanguageName(config: Config, extension: string): string
    {
        for (const language in config.languageExtensionsMap) {
            if (config.languageExtensionsMap[language].indexOf(extension) > -1) {
                return language;
            }
        }

        throw new Error(`Extension '${extension}' is not mapped to any Language.`);
    }
}
