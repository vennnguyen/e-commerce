"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
// import { useTranslations } from "next-intl";
import { getPublicApiV1Base } from "@/lib/api/api-url";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
//   const t = useTranslations("auth.verifyEmail");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    token && email ? "idle" : "err",
  );
  const [message, setMessage] = useState(
    token && email ? "" : "Missing verification parameters.",
  );

  useEffect(() => {
    if (!token || !email) return;

    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setStatus("loading");
    const url = `${getPublicApiV1Base()}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    void fetch(url, { credentials: "include", mode: "cors" })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus("err");
          setMessage((data as { message?: string }).message || "Failed to verify email.");
          return;
        }
        setStatus("ok");
        setMessage((data as { message?: string }).message || "Email verified successfully.");
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setStatus("err");
        setMessage("An error occurred while verifying the email.");
      });
  }, [token, email]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Verify Email</h1>
      {status === "loading" && (
        <p className="text-muted-foreground">Verifying email...</p>
      )}
      {(status === "ok" || status === "err") && (
        <p className={status === "ok" ? "text-green-600" : "text-destructive"}>
          {message}
        </p>
      )}
      <Button asChild variant="outline">
        <Link href="/auth/signin">Back to Sign In</Link>
      </Button>
    </div>
  );
}
