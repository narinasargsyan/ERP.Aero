import * as crypto from "crypto";

interface Options {
  algorithm: string;
  saltLength: number;
  iterations: number;
  tokenLength: number;
}

const options: Options = {
  algorithm: "sha256",
  saltLength: 8,
  iterations: 1,
  tokenLength: 12,
};

const saltChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl$nopqrstuvwxyz0123456789";
const saltCharsCount = saltChars.length;

export const generateSalt = (len: number): string => {
  if (typeof len !== "number" || len <= 0 || len !== parseInt(len.toString(), 10)) {
    throw new Error("Invalid salt length");
  }
  if (crypto.randomBytes) {
    return crypto
      .randomBytes(Math.ceil(len / 2))
      .toString("hex")
      .substring(0, len);
  }
  let salt = "";
  for (let i = 0; i < len; i++) {
    salt += saltChars.charAt(Math.floor(Math.random() * saltCharsCount));
  }
  return salt;
};

export const generateHash = (algorithm: string, salt: string, password: string, iterations = 1): string => {
  try {
    let hash = password;
    for (let i = 0; i < iterations; ++i) {
      hash = crypto.createHmac(algorithm, salt).update(hash)
        .digest("hex");
    }
    return `${algorithm}m${salt}m${iterations}m${hash}`;
  } catch (error) {
    throw new Error("Invalid message digest algorithm");
  }
};

export const hashPassword = (password: string): string => {
  if (typeof password !== "string") {
    throw new Error("Invalid password");
  }
  const salt = generateSalt(options.saltLength);

  const algorithm = "sha256";

  return generateHash(algorithm, salt, password, options.iterations);
};

export const verifyHashPassword = (password: string, hashedPassword: string): boolean => {
  if (!password || !hashedPassword) {
    return false;
  }
  const parts = hashedPassword.split("m");
  if (parts.length !== 4) {
    return false;
  }
  try {
    return generateHash(parts[0], parts[1], password, Number(parts[2])) === hashedPassword;
  } catch (error) {}
  return false;
};

