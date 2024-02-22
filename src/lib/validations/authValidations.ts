export const hasLowerCase = (str: string) => {
	return /[a-z]/.test(str);
};

export const hasUpperCase = (str: string) => {
	return /[A-Z]/.test(str);
};

export const hasMinAllowedCharacters = (str: string = '') => {
	return str.length >= 8;
};

export const hasNumber = (str: string) => {
	return /\d/.test(str);
};

export const hasSpecialCharacter = (str: string) => {
	return /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(str);
};
