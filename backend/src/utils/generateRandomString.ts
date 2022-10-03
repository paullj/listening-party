const generateRandomString = (length: number, chars: string) => {
	var result = "";
	for (let i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];

	return result;
};

export { generateRandomString };
