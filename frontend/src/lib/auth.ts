import { Pool } from "pg";
import { betterAuth } from "better-auth";
import { parseEnvOrigins } from "./parse-env-origins";
import { v7 as uuidv7 } from "uuid";
function getAppUrl(): string {
  const raw =
    process.env.BETTER_AUTH_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function useCrossSiteAuthCookies(): boolean {
  if (process.env.BETTER_AUTH_SAMESITE_NONE === "false") {
    return false;
  }
  if (process.env.BETTER_AUTH_SAMESITE_NONE === "true") {
    return true;
  }
  const url = process.env.BETTER_AUTH_URL || "";
  return url.startsWith("https://");
}

const authCookieRootDomain =
  process.env.BETTER_AUTH_COOKIE_DOMAIN?.trim().replace(/^\./, "") || "";

// eslint-disable-next-line react-hooks/rules-of-hooks
const crossSiteCookies = useCrossSiteAuthCookies();
const advancedAuth =
  crossSiteCookies || authCookieRootDomain
    ? {
        advanced: {
          ...(crossSiteCookies
            ? {
                defaultCookieAttributes: {
                  sameSite: "none" as const,
                  secure: true,
                },
              }
            : {}),
          ...(authCookieRootDomain
            ? {
                crossSubDomainCookies: {
                  enabled: true,
                  domain: authCookieRootDomain,
                },
              }
            : {}),
        },
      }
    : {};

//database
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "ecommerce",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const appUrl = getAppUrl();

export const auth = betterAuth({
  plugins: [],
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  secret: process.env.BETTER_AUTH_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || appUrl,
  basePath: "/api/auth",
  ...advancedAuth,
  trustedOrigins: parseEnvOrigins(
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.CLIENT_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_LANDING_URL,
    process.env.BETTER_AUTH_TRUSTED_ORIGINS,
    appUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3002",
    "http://127.0.0.1:3002",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ),
  // session: {
  //   expiresIn: 60 * 60 * 24 * 7,
  //   updateAge: 60 * 60 * 24,
  // },
  user: {
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      emailVerified: "email_verified",
    },
  },

  session: {
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  account: {
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
    },
  },

  verification: {
    fields: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      expiresAt: "expires_at",
    },
  },
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
  },
});