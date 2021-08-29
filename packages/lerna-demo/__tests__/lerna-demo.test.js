'use strict';

const lernaDemoFn = require('..');

describe('lerna-demo', () => {
    it('erna-demo-fn tests', () => {
        expect(lernaDemoFn()).toEqual('lerna-demo');
    });
});
