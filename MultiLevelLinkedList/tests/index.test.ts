import { getString } from '../src/index';

describe('testing index file', () => {
    test('empty string should result in zero', () => {
        expect(getString('abc')).toBe('Hello World abc');
    });
});