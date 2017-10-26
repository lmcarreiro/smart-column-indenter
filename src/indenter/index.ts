import Indenter from "./Indenter";

try {
    let indenter = new Indenter("./src/indenter/config.json");
    indenter.indent();
}
catch (error) {
    console.log("\x1b[31m", `\n\n  Error: ${error}\n\n`);
    process.exit(1);
}
