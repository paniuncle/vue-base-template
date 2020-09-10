import CryptoJS from 'crypto-js';

function getString(dict) {
  let keys = Object.keys(dict);
  keys = keys.sort();
  const newArgs = {};
  keys.forEach((key) => {
    if (dict[key] !== '' && dict[key] !== 'undefined') {
      newArgs[key] = dict[key];
    }
  });
  let string = '';
  for (const k in newArgs) {
    string += `&${k}=${newArgs[k]}`;
  }
  string = string.substr(1);
  return string;
}
function randomString(len) {
  len = len || 32;
  const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function getSignatureDict(_dict, user_id, token) {
  const timestamp = Date.parse(new Date());
  const nonce = randomString(16);
  const string1 = getString(_dict);
  const string2 = `${string1}&user_id=${user_id}&timestamp=${timestamp}&nonce_str=${nonce}`;
  const signal = CryptoJS.HmacSHA256(string2, token);
  return { signature: signal, timestamp, nonce_str: nonce };
}

export default getSignatureDict;
