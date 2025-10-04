export const API_BASE_URL = "http://localhost:5148";

export type StravaTokenRequest = {
  code: string;
  grant_type?: string;
};

export async function exchangeStravaCode(
  req: StravaTokenRequest
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/strava/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: req.code,
      grant_type: req.grant_type || "authorization_code",
    }),
  });

  const text = await response.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      typeof json === "object" ? JSON.stringify(json) : String(json)
    );
  }

  return json;
}
