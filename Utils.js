exports.randomise = (min, max) =>
{
    return Math.floor(Math.random() * (max - min)) + min;
}

exports.factorial = (num) =>
{
    if (num == 1) 
	{
  		return 1;
	}
	return num * exports.factorial(num - 1);
}