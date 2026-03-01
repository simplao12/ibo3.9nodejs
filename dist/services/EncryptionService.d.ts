/**
 * Port of PHP Encryption::run() - bin2hex + strrev
 * Used in api/index.php to encrypt JSON response
 */
export declare function simpleEncrypt(input: string): string;
/**
 * Port of PHP Encryption::runfake() - generates random string
 */
export declare function randomFakeString(length?: number): string;
/**
 * Port of PHP getDecodedString() from Getappuser.php
 * CRITICAL: Mobile app depends on this exact algorithm
 */
export declare function getDecodedString(str: string): string;
/**
 * Port of PHP getEncodedString() from Getappuser.php
 * CRITICAL: Mobile app depends on this exact algorithm
 */
export declare function getEncodedString(str: string): string;
/**
 * Port of PHP encr() from api/dns.php
 * AES-256-CBC encryption with fixed IV
 */
export declare function dnsEncrypt(data: string, key1: string, key2: string): string;
/**
 * Generate a random hex key of given length
 */
export declare function generateRandomKey(length?: number): string;
//# sourceMappingURL=EncryptionService.d.ts.map