import axios from "axios";

const internalApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/internal`,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

interface SendAuthEmailPayload {
  to: string;
  name: string;
  url: string;
}

async function postAuthEmail(
  path: "/email/verification" | "/email/password-reset",
  payload: SendAuthEmailPayload,
): Promise<void> {
  const secret = process.env.INTERNAL_API_SECRET?.trim();

  if (!secret) {
    console.error(
      "[auth] INTERNAL_API_SECRET is not set — auth email was NOT sent",
    );
    return;
  }

  try {
    const res = await internalApi.post<{ success: boolean }>(path, payload, {
      headers: { "X-Internal-Secret": secret },
    });

    if (res.data?.success !== true) {
      console.error(`[auth] Backend reported email delivery failure (${path})`);
    }
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;

    console.error(
      `[auth] Auth email request failed (${path}${status ? `, ${status}` : ""})`,
    );
  }
}

export async function sendVerificationEmail(
  to: string,
  name: string,
  url: string,
): Promise<void> {
  
  await postAuthEmail("/email/verification", { to, name, url });
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  url: string,
): Promise<void> {
  await postAuthEmail("/email/password-reset", { to, name, url });
}
