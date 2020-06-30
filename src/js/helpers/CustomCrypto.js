import Crypto from 'crypto-js';

const ENABLE_CRYPTO = true;
const secretKey = 'axgksjvodu3dkgchskfk';

export default class CustomCrypto {
  static encrypt(plaintext) {
    if (!ENABLE_CRYPTO) return plaintext;
    const textEncode = Crypto.AES.encrypt(plaintext, secretKey);
    return textEncode.toString();
  }

  static decrypt(encode) {
    if (!ENABLE_CRYPTO) return encode;
    const plainText = Crypto.AES.decrypt(encode.toString(), secretKey);
    return plainText.toString(Crypto.enc.Utf8);
  }
}
