// lib/kroger-auth.ts
// Server-only helper — never import on the client side.

let cachedToken: { access_token: string; expires_at: number } | null = null;

export async function getKrogerToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at - 30_000) {
    return cachedToken.access_token;
  }

  const clientId = process.env.KROGER_CLIENT_ID ?? "";
  const clientSecret = process.env.KROGER_CLIENT_SECRET ?? "";

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing KROGER_CLIENT_ID or KROGER_CLIENT_SECRET env vars"
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch("https://api.kroger.com/v1/connect/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials&scope=product.compact",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kroger OAuth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    access_token: data.access_token,
    expires_at: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.access_token;
}
