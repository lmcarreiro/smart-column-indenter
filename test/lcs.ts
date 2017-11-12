import * as assert          from 'assert';
import Sequence             from "../src/LCS/Sequence";
import RecursiveInGroupsLCS from "../src/LCS/RecursiveInGroupsLCS";

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

        it('borders vs middles', () => {
            const sequences = [
                "XaaabbbX",
                "aaaXXbbb",
                "XcccdddX",
                "cccXXddd"
            ];
            const expected = "XX";

            test(sequences, expected);
        });

        it('constant diagonal 1-length inside 4-length LCS', () => {
            const sequences = [
                "Xabcd",
                "aXbcd",
                "abXcd",
                "abcXd",
                "abcdX"
            ];
            const expected = "abcd";

            test(sequences, expected);
        });

        it('constant diagonal 4-length inside 5-length LCS', () => {
            const sequences = [
                "wxyzABCDE",
                "AwxyzBCDE",
                "ABwxyzCDE",
                "ABCwxyzDE",
                "ABCDwxyzE",
                "ABCDEwxyz"
            ];
            const expected = "ABCDE";

            test(sequences, expected);
        });
        
        it('variant diagonal 5-length inside 5-length LCS', () => {
            const sequences = [
                "abcdeVWXYZ",
                "VabcdfWXYZ",
                "VWabcefXYZ",
                "VWXabdefYZ",
                "VWXYacdefZ",
                "VWXYZbcdef"
            ];
            const expected = "VWXYZ";

            test(sequences, expected);
        });

        it('variant diagonal 5-length inside 5-length (with mixed chars in the middle) LCS', () => {
            const sequences = [
                "abcdegVhWiXjYkZl",
                "lVabcdfgWhXiYjZk",
                "kVlWabcefgXhYiZj",
                "jVkWlXabdefgYhZi",
                "iVjWkXlYacdefgZh",
                "hViWjXkYlZbcdefg"
            ];
            const expected = "VWXYZ";

            test(sequences, expected);
        });

    });

});
