
function removeWhiteSpace(input)
{
		return input.replace(/^\s\s*/, ''); //Remove preceeding white space
}

//input = the value to be tested
function containsOnlyLetters(input)
{
	return /^[a-zA-Z]/.test(input.replace(/\s/g, ''));
}

//@input: 2 arrays
//output: true if they are exactly the same, false if they are not
function areArraysSame(array1, array2) {
    if (array1.length != array2.length) return false;
    for (var i = 0; i < array2.length; i++) {
        if (array1[i].compare) { 
            if (!array[i].compare(array2[i])) return false;
        }
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}