const { sum, sub, mul, div } = require('./math_operations');
const { isPalindrome, isAnagram} = require('./string_operations');

describe('math_operations tests', () => {
    test('1 + 2 = 3', () => {
        expect(sum(1, 2)).toBe(3);
    });

    test('2 * 3 = 6', () => {
        expect(mul(2, 3)).toBe(6);
    });

    test('3 - 2 = 1', () => {
        expect(sub(3, 2)).toBe(1);
    });

    test('6 / 3 = 2', () => {
        expect(div(6, 3)).toBe(2);
    });

    test.each([
        [4, 5, 9],
        [1, -8, -7],
        [2, 1, 3],
    ])('%i + %i = %i', (a, b, expected) => {
        expect(sum(a, b)).toBe(expected);
    });

    test.each([
        [2.5, 3.0, 7.5],
        [0, 2, 0],
        [2.5, 6.4, 16.0],
    ])('%i * %i = %i', (a, b, expected) => {
        expect(mul(a, b)).toBe(expected);
    });
});

describe('string_operations tests', () => {
    test('isPalindrome test', () => {
        expect(isPalindrome('level')).toBe(true);
        expect(isPalindrome('start')).toBe(false);
    });

    test('isAnagram test', () => {
        expect(isAnagram('night', 'thing')).toBe(true);
        expect(isAnagram('lock', 'clock')).toBe(false);
    });
});
