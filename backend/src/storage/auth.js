import crypto from "crypto";

export function hashPassword(password, salt) {
  const effectiveSalt = salt || crypto.randomBytes(16).toString("base64url");
  const derived = crypto.scryptSync(password, effectiveSalt, 64, { N: 16384, r: 8, p: 1 });
  return {
    salt: effectiveSalt,
    hash: derived.toString("base64url"),
  };
}

export function verifyPassword(password, { salt, hash }) {
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return derived.toString("base64url") === hash;
}

