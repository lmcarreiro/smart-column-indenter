import Config from '../../Config';
import Scanner from "./Scanner";
import TypeScriptScanner from "../TypeScriptScanner";
import XmlScanner from "../XmlScanner";

export default class ScannerFactory {
    public static getScanner(config: Config, extension: string): Scanner
    {
        const scannerName = ScannerFactory.getScannerName(config, extension);

        switch (scannerName) {
            case "TypeScriptScanner": return new TypeScriptScanner();
            case "XmlScanner": return new XmlScanner();
            default: throw new Error(`Scanner '${scannerName}' doesn't exist.`);
        }
    }

    private static getScannerName(config: Config, extension: string): string
    {
        for (const scanner in config.scannerExtensionsMap) {
            if (config.scannerExtensionsMap[scanner].indexOf(extension) > -1) {
                return scanner;
            }
        }

        throw new Error(`Extension '${extension}' is not mapped to any Scanner.`);
    }
}
