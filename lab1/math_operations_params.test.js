const { sum, sub, mul, div } = require('./math_operations');

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

test.each([
    [-5.3, -1.2, -4.1],
    [5.0, 2.0, 3.0],
    [2.6, 1.0, 1.6],
])('%f - %f = %f', (a, b, expected) => {
    expect(sub(a, b)).toBe(expected);
});

test.each([
    [-2, 0.8, -2.5],
    [0.25, 2, 0.125],
    [8, 4, 2],
])('%f / %f = %f', (a, b, expected) => {
    expect(div(a, b)).toBe(expected);
});
