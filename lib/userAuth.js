import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "travel_unbounded_user";

const TOKEN_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }

  return secret;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return {
    hash,
    salt,
  };
}

function createToken(userId, email) {
  const timestamp = Date.now().toString();

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${userId}.${email}.${timestamp}`)
    .digest("hex");

  return Buffer.from(
    JSON.stringify({
      userId,
      email,
      timestamp,
      signature,
    })
  ).toString("base64url");
}

function verifyToken(token) {
  try {
    if (!token) {
      return null;
    }

    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    const {
      userId,
      email,
      timestamp,
      signature,
    } = decoded;

    if (!userId || !email || !timestamp || !signature) {
      return null;
    }

    const age = Date.now() - Number(timestamp);

    if (age < 0 || age > TOKEN_MAX_AGE) {
      return null;
    }

    const expectedSignature = crypto
      .createHmac("sha256", getSecret())
      .update(`${userId}.${email}.${timestamp}`)
      .digest("hex");

    const receivedBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(expectedSignature, "utf8");

    if (receivedBuffer.length !== expectedBuffer.length) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      return null;
    }

    return {
      userId,
      email,
    };
  } catch {
    return null;
  }
}

export function createUserToken(userId, email) {
  return createToken(userId, email);
}

export function getUserCookieName() {
  return COOKIE_NAME;
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifyToken(token);
}

export async function isUserAuthenticated() {
  const user = await getAuthenticatedUser();

  return Boolean(user);
}
