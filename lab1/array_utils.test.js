const { sumAll, filterPositive, filterNegative} = require('./array_utils');

var testArray = [];
var positiveArray = [];
var negativeArray = [];
var sumArray = 0;

beforeAll(() => {
    for (var i=0; i < 15; i++) {
        var newNumber = Math.round(Math.random() * 20) - 10;
        testArray.push(newNumber);
        ((newNumber >= 0) ? positiveArray : negativeArray).push(newNumber);
        sumArray += newNumber;
    }
});

test('sumAll test', () => {
    expect(sumAll(testArray)).toBe(sumArray);
});

test('filterPositive test', () => {
    expect(filterPositive(testArray)).toStrictEqual(positiveArray);
});

test('filterNegative test', () => {
    expect(filterNegative(testArray)).toStrictEqual(negativeArray);
});
