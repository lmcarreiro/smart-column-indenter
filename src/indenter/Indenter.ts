import * as fs from 'fs';
import Config from './Config';

export default class Indenter
{
    private config: Config;

    public constructor(configPath: string) {
        var jsonConfig = fs.readFileSync(configPath, { encoding: "utf-8" });
        this.config = JSON.parse(jsonConfig);
    }

    public indent(): void
    {
        throw new Error("Not implemented yet.");
    }
}