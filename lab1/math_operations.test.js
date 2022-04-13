const { sum, sub, mul, div } = require('./math_operations');

test('1 + 2 = 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('-4 + 2 = -2', () => {
    expect(sum(-4, 2)).toBe(-2);
});


test('2 * 3 = 6', () => {
    expect(mul(2, 3)).toBe(6);
});

test('0.5 * 3 = 1.5', () => {
    expect(mul(0.5, 3)).toBe(1.5);
});


test('3 - 2 = 1', () => {
    expect(sub(3, 2)).toBe(1);
});

test('3 - 8 = -5', () => {
    expect(sub(3, 8)).toBe(-5);
});


test('6 / 3 = 2', () => {
    expect(div(6, 3)).toBe(2);
});

test('9 / 0.25 = 36', () => {
    expect(div(9, 0.25)).toBe(36);
});
