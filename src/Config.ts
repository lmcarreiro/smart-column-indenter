export default interface IndenterConfig {
    scannerExtensionsMap: { [scannerName: string]: Extensions }
}

type Extensions = string[];
