import crypto from 'crypto-js';

const SECRET_KEY = 'Z64X6gzY1mj5eKfQQrULjm78OHWSzG5XK6GkC4TWiCv';

export const encryptData = (text: string) => {
  return crypto.AES.encrypt(text, SECRET_KEY).toString();
}

export const decryptData = (cipher: string): string => {
  const bytes = crypto.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(crypto.enc.Utf8);
};

export const encryptDataURI = (text: string) => {
  return encodeURIComponent(encryptData(text));
}

export const decryptDataURI = (cipher: string): string => {
  return decodeURIComponent(decryptData(cipher));
};