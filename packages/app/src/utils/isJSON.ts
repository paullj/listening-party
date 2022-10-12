const isJSON = (text: string) => {
	try {
		JSON.parse(text);
	} catch (error) {
		return false;
	}
	return true;
};

export { isJSON };
