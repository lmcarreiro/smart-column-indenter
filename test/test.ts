import * as assert from 'assert';
import Indenter from '../src/indenter/Indenter';

describe('Indenter', () => {

    describe('indent()', () => {

        it('test 1', () => {

            let code = `
                import * as assert from 'assert';
                import Indenter from '../src/indenter/Indenter';
            `;

            let expected = `
                import * as assert from 'assert'                  ;
                import Indenter    from '../src/indenter/Indenter';
            `;

            let indenter = new Indenter(<any>{});
            let result = indenter.indent(code);
            assert.equal(result, expected);
        });

    });

});
