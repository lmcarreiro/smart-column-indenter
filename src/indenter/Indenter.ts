import * as fs from 'fs';
import Config from './Config';

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
        //TODO: implement the indenter
        return code;
    }
}