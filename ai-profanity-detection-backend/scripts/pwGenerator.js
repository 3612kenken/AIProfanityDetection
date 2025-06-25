const crypto = require('crypto');

function generatePassword(length = 12, options = {}) {
  const {
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = options;

  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let tokenHashCharacters = '';
  if (uppercase) tokenHashCharacters += upperChars;
  if (lowercase) tokenHashCharacters += lowerChars;
  if (numbers) tokenHashCharacters += numberChars;
  if (symbols) tokenHashCharacters += symbolChars;

  if (!tokenHashCharacters.length) {
    throw new Error('At least one character type must be enabled.');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, tokenHashCharacters.length);
    password += tokenHashCharacters[index];
  }

  return password;
}

// Example usage
const password = generatePassword(16, { uppercase: true, lowercase: true, numbers: true, symbols: true });
console.log('Generated Password:', password);
