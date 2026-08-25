import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "travel_unbounded_admin";

function getSecret() {
  const secret = process.env.ADMIN_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }

  return secret;
}

function createToken(username) {
  const timestamp = Date.now().toString();

  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(`${username}.${timestamp}`)
    .digest("hex");

  return Buffer.from(
    JSON.stringify({
      username,
      timestamp,
      signature,
    })
  ).toString("base64url");
}

function verifyToken(token) {
  try {
    if (!token) {
      return false;
    }

    const decoded = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    const { username, timestamp, signature } = decoded;

    if (!username || !timestamp || !signature) {
      return false;
    }

    if (username !== process.env.ADMIN_USERNAME) {
      return false;
    }

    const age = Date.now() - Number(timestamp);

    const maxAge = 1000 * 60 * 60 * 8;

    if (age < 0 || age > maxAge) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac("sha256", getSecret())
      .update(`${username}.${timestamp}`)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export function createAdminToken() {
  return createToken(process.env.ADMIN_USERNAME);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  return verifyToken(token);
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}