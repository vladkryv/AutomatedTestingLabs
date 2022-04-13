const sumAll = (arr) => arr.reduce((a, b) => a+b);

const filterPositive = (arr) => arr.filter(number => number >= 0);

const filterNegative = (arr) => arr.filter(number => number < 0);

module.exports = { sumAll, filterPositive, filterNegative};
