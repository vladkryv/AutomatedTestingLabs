const isPalindrome = (str) => (str == str.split('').reverse().join(''));
const isAnagram = (str1, str2) => (str1.split('').sort().join('') == str2.split('').sort().join(''));

module.exports = { isPalindrome, isAnagram};
