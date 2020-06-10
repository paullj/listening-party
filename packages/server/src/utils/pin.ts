import crypto from 'crypto';

const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const generateRandomPin = (length: number): string => {
  const buffer = crypto.randomBytes(length);
  const result = new Array(buffer.length);
  let cursor = 0;
  for (let i = 0; i < buffer.length; i += 1) {
    cursor += buffer[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join('');
};

export { generateRandomPin };
