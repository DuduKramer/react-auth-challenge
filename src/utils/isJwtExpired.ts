export function isJwtExpired(token: string): boolean {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload));
    const exp = Number(json?.exp);
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= exp;
  } catch {
    return true;
  }
}
