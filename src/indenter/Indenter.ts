import * as fs from 'fs';
import Config  from './Config';
import Scanner from './Scanner';

export default class Indenter
{
    private config: Config;

    public constructor(config: string|Config) {
        if (typeof config === "string") {
            var jsonConfig = fs.readFileSync(config, { encoding: "utf-8" });
            this.config = JSON.parse(jsonConfig);
        }
        else {
            //TODO: load default config and override with parameter object
            this.config = config;
        }
    }

    public indent(code: string): string
    {
        let scanner = new Scanner(code);
        var tokens = scanner.scan();
        
        console.log(tokens);
        
        return code;
    }
}