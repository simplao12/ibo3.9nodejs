"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleEncrypt = simpleEncrypt;
exports.randomFakeString = randomFakeString;
exports.getDecodedString = getDecodedString;
exports.getEncodedString = getEncodedString;
exports.dnsEncrypt = dnsEncrypt;
exports.generateRandomKey = generateRandomKey;
const crypto_1 = __importDefault(require("crypto"));
const ALLOWED_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
/**
 * Port of PHP Encryption::run() - bin2hex + strrev
 * Used in api/index.php to encrypt JSON response
 */
function simpleEncrypt(input) {
    const hex = Buffer.from(input, 'utf8').toString('hex');
    return hex.split('').reverse().join('');
}
/**
 * Port of PHP Encryption::runfake() - generates random string
 */
function randomFakeString(length = 500) {
    const chars = ALLOWED_CHARACTERS;
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
/**
 * Port of PHP getEncryptKeyPosition()
 */
function getEncryptKeyPosition(char) {
    return ALLOWED_CHARACTERS.indexOf(char);
}
/**
 * Port of PHP getDecodedString() from Getappuser.php
 * CRITICAL: Mobile app depends on this exact algorithm
 */
function getDecodedString(str) {
    const pos1 = getEncryptKeyPosition(str.charAt(str.length - 2));
    const pos2 = getEncryptKeyPosition(str.charAt(str.length - 1));
    const substring = str.slice(0, -2);
    const base64Part = substring.slice(0, pos1) + substring.slice(pos1 + pos2);
    const decoded = Buffer.from(base64Part, 'base64').toString('latin1');
    // Port of PHP utf8_decode - convert utf8 to latin1, then trim
    return decoded.trim();
}
/**
 * Port of PHP getEncodedString() from Getappuser.php
 * CRITICAL: Mobile app depends on this exact algorithm
 */
function getEncodedString(str) {
    // PHP utf8_encode converts latin1 to utf8, but str is already utf8
    // so we just base64 encode it
    const encodedString = Buffer.from(str, 'utf8').toString('base64');
    // Use last 2 chars of input (before encoding) to determine positions
    const pos1 = getEncryptKeyPosition(str.charAt(str.length - 2));
    const pos2 = getEncryptKeyPosition(str.charAt(str.length - 1));
    const substring = encodedString.slice(0, pos1) + encodedString.slice(pos1 + pos2);
    return (substring +
        ALLOWED_CHARACTERS.charAt(pos1) +
        ALLOWED_CHARACTERS.charAt(pos2));
}
/**
 * Port of PHP encr() from api/dns.php
 * AES-256-CBC encryption with fixed IV
 */
function dnsEncrypt(data, key1, key2) {
    const key = key1 + key2;
    const iv = Buffer.from('R4tghjg^425(@#Gg', 'utf8');
    const keyBuf = Buffer.alloc(32);
    Buffer.from(key, 'utf8').copy(keyBuf);
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', keyBuf, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const reversedKey1 = key1.split('').reverse().join('');
    return encrypted + reversedKey1;
}
/**
 * Generate a random hex key of given length
 */
function generateRandomKey(length = 16) {
    return crypto_1.default.randomBytes(length).toString('hex').substring(0, length);
}
//# sourceMappingURL=EncryptionService.js.map