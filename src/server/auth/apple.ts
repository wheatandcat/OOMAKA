import { SignJWT, importPKCS8 } from "jose";
import { env } from "~/env.js";

// Appleの仕様上、Client Secret(JWT)の有効期限は最長6か月。
// 手動ローテーションを不要にするため、.p8秘密鍵から短期間のJWTを都度生成してキャッシュする
const EXPIRES_IN_SECONDS = 60 * 60;
// 期限切れ直前のJWTを使わないよう、残り時間がこれを下回ったら再生成する
const REFRESH_MARGIN_SECONDS = 5 * 60;

let cached: { secret: string; exp: number } | undefined;

export const getAppleClientSecret = async (): Promise<string | undefined> => {
  const privateKey = env.AUTH_APPLE_PRIVATE_KEY;
  const keyId = env.AUTH_APPLE_KEY_ID;
  const teamId = env.AUTH_APPLE_TEAM_ID;
  const clientId = env.AUTH_APPLE_ID;

  // 秘密鍵が未設定の場合は従来の固定Secretを使う
  if (!privateKey || !keyId || !teamId || !clientId) {
    return env.AUTH_APPLE_SECRET;
  }

  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.exp - now > REFRESH_MARGIN_SECONDS) {
    return cached.secret;
  }

  // 環境変数に改行を`\n`でエスケープして登録した場合にも対応する
  const key = await importPKCS8(privateKey.replace(/\\n/g, "\n"), "ES256");
  const exp = now + EXPIRES_IN_SECONDS;
  const secret = await new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setSubject(clientId)
    .setAudience("https://appleid.apple.com")
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(key);

  cached = { secret, exp };
  return secret;
};
