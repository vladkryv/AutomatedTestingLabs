const { isPalindrome, isAnagram} = require('./string_operations');

test('isPalindrome test', () => {
    expect(isPalindrome('level')).toBe(true);
    expect(isPalindrome('start')).not.toBe(true);
});

test('isAnagram test', () => {
    expect(isAnagram('night', 'thing')).toBe(true);
    expect(isAnagram('lock', 'clock')).not.toBe(true);
});
