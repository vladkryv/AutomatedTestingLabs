const hasElement = (arr, toSearch) => arr.includes(toSearch);
const hasSubstring = (str, substring) => str.indexOf(substring) != -1;
const getObj = () => "example";

const applyForAllElementArray = (arr, callback) => {
    for(i = 0; i < arr.length; i++)
        arr[i] = callback(arr[i]);
}

const applyForWords = (sentence, callback) => {
    words = sentence.split(' ');

    for(i = 0; i < words.length; i++)
        callback(arr[i]);
}

const ownerLab = {
    firstname: 'Vladyslav',
    lastname: 'Kryvoviaz',
    introduce() { console.log('Hello, I’m ' + this.firstname + this.lastname) }
};

module.exports = { hasElement, hasSubstring, getObj, ownerLab, applyForAllElementArray};
