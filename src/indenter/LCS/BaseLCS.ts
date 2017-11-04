import Sequence from "./Sequence";

export default abstract class BaseLCS
{
    public execute(sequences: Sequence[]): Sequence
    {
        sequences = this.filterSequences(sequences);

        const cutHead = this.cutCommonHead(sequences);
        sequences = cutHead.sequencesWithoutHead;

        const cutTail = this.cutCommonTail(sequences);
        sequences = cutTail.sequencesWithoutTail;

        return [
            ...cutHead.commonHead,
            ...this.executeLCS(sequences),
            ...cutTail.commonTail
        ];
    }

    private executeLCS(sequences: Sequence[]): Sequence
    {
        if (sequences.some(s => s.length === 0)) return [];
        
        switch (sequences.length) {
            case 0: return [];
            case 1: return sequences[0];
            case 2: return this.executeForTwo(sequences[0], sequences[1]);
            case 3: return this.executeForThree(sequences[0], sequences[1], sequences[2]);
            default: return this.executeForMoreThanThree(sequences);
        }
    }

    protected abstract executeForMoreThanThree(sequences: Sequence[]): Sequence;
    
    private executeForThree(a: Sequence, b: Sequence, c: Sequence): Sequence
    {
        //TODO: replace this implementation for the Dynamic Programming version for three sequences
        return this.executeForMoreThanThree([a, b, c]);
    }

    private executeForTwo(a: Sequence, b: Sequence): Sequence
    {
        //TODO: replace this implementation for the Dynamic Programming version for two sequences
        const seq1 = this.execute([a, b.slice(0, -1)]);
        const seq2 = this.execute([b, a.slice(0, -1)]);

        return seq1.length >= seq2.length ? seq1 : seq2;
    }

    /**
     * Filter the sequences removing elements that aren't present in all sequences
     */
    private filterSequences(sequences: Sequence[]): Sequence[]
    {
        const distinctValuesPerSequence = sequences.map(s => new Set(s));
        
        let smallerSet = distinctValuesPerSequence[0];
        distinctValuesPerSequence.forEach(s => smallerSet = s.size < smallerSet.size ? s : smallerSet);

        const intersection = new Set([...smallerSet].filter(e => distinctValuesPerSequence.every(s => s.has(e))));

        return sequences.map(s => s.filter(e => intersection.has(e)));
    }

    private cutCommonHead(sequences: Sequence[]): { commonHead: Sequence, sequencesWithoutHead: Sequence[] }
    {
        if (sequences[0].length) {
            const first = sequences[0][0];

            if (sequences.every(s => s.length > 0 && s[0] === first)) {
                var recursiveCut = this.cutCommonHead(sequences.map(s => s.slice(1)));

                return {
                    commonHead: [first, ...recursiveCut.commonHead],
                    sequencesWithoutHead: recursiveCut.sequencesWithoutHead
                }
            }
        }
        
        return {
            commonHead: [],
            sequencesWithoutHead: sequences
        };
    }

    private cutCommonTail(sequences: Sequence[]): { commonTail: Sequence, sequencesWithoutTail: Sequence[] }
    {
        if (sequences[0].length) {
            const last = sequences[0][sequences[0].length - 1];

            if (sequences.every(s => s.length > 0 && s[s.length - 1] === last)) {
                var recursiveCut = this.cutCommonTail(sequences.map(s => s.slice(0, -1)));
                
                return {
                    commonTail: [...recursiveCut.commonTail, last],
                    sequencesWithoutTail: recursiveCut.sequencesWithoutTail
                }
            }
        }
        
        return {
            commonTail: [],
            sequencesWithoutTail: sequences
        };
    }
}
