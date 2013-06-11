
function removeWhiteSpace(input)
{
		return input.replace(/^\s\s*/, ''); //Remove preceeding white space
}

//input = the value to be tested
function containsOnlyLetters(input)
{
	return /^[a-zA-Z]/.test(input.replace(/\s/g, ''));
}
