import crypto from 'crypto-js';

const SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

export const encryptData = (text: string) => crypto.AES.encrypt(text, SECRET_KEY).toString();

export const decryptData = (cipher: string): string => crypto.AES.decrypt(cipher, SECRET_KEY).toString(crypto.enc.Utf8);

export const encryptDataURI = (text: string) => encodeURIComponent(encryptData(text));

export const decryptDataURI = (cipher: string): string => decodeURIComponent(decryptData(cipher));