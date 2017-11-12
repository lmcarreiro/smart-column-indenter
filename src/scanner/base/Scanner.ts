import Token from "../../Token";

export default abstract class Scanner {
    public abstract scan(code: string): Token[];
}
