import crypto from "crypto";

// 暗号化用のキーを生成
const generateKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
};

const bufferToBase64 = (buf: ArrayBuffer): string => {
  const byteArr = new Uint8Array(buf);
  let str = "";
  for (let i = 0; i < byteArr.byteLength; i++) {
    str += String.fromCharCode(byteArr[i]!);
  }
  return window.btoa(str);
};

// テキストを暗号化
const encryptText = async (text: string) => {
  const key = await generateKey();
  const encodedText = new TextEncoder().encode(text);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedText
  );

  const base64String = bufferToBase64(encrypted);
  return base64String;
};

// 暗号化されたテキストを復号
const decryptText = async (encrypted: ArrayBuffer) => {
  const key = await generateKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encrypted
  );
  const decodedText = new TextDecoder().decode(decrypted);
  return decodedText;
};

function hashText(text: string): string {
  // SHA-256ハッシュ関数を使用
  const hash = crypto.createHash("sha256");
  hash.update(text);
  return hash.digest("hex"); // ハッシュ値を16進数の文字列として出力
}

export { encryptText, decryptText, hashText };
