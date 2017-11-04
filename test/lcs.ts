import * as assert          from 'assert';
import Sequence             from "../src/indenter/LCS/Sequence";
import RecursiveInGroupsLCS from "../src/indenter/LCS/RecursiveInGroupsLCS";

function test(sequences: string[], expectedLCS: string): void
{
    testWithSequences(sequences.map(str => str.split("")), expectedLCS.split(""));
}

function testWithSequences(sequences: Sequence[], expectedLCS: Sequence): void
{
    let lcs = new RecursiveInGroupsLCS();
    let result = lcs.execute(sequences);
    assert.deepEqual(result, expectedLCS);
}

describe('LCS', () => {

    describe('execute()', () => {

        it('test 1', () => {
            const sequences = [
                "xaaabbbx",
                "aaaxxbbb",
                "xcccdddx",
                "cccxxddd"
            ];
            const expected = "xx";

            test(sequences, expected);
        });

    });

});
