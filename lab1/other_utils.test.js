const { hasElement, hasSubstring, getObj, ownerLab, applyForAllElementArray } = require('./other_utils');

test('Has element in Array test', () => {
    var tmpArray = [1, 2, 3, 4, 5];
    expect(hasElement(tmpArray, 4)).toBe(true);
    expect(hasElement(tmpArray, 6)).toBe(false);
});

test('Has substring in word test', () => {
    var word = 'clock';
    expect(hasSubstring(word, 'lock')).toBe(true);
    expect(hasSubstring(word, 'cat')).toBe(false);
});

test('check has field test', () => {
    expect(getObj().hasOwnProperty('length')).toBe(true);
    expect(getObj().hasOwnProperty('lengh')).toBe(false);
});

test('check count call calback for array', () => {
    const mockCallback = jest.fn((value) => value++);
    applyForAllElementArray([1,2,3,4], mockCallback)
    expect(mockCallback.mock.calls.length).toBe(4);
    expect(mockCallback.mock.calls.length).not.toBe(6);
});

var spyCountCall = jest.spyOn(ownerLab, 'introduce');
ownerLab.introduce();
ownerLab.introduce();
console.log('Number of method calls \'introduce\' in \'ownerLab\': ' + ownerLab.introduce.mock.calls.length)
spyCountCall.mockRestore();
