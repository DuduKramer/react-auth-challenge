import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/api/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/B2bit-logo.png";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("auth.tokens");
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw);
        if (accessToken) nav("/home", { replace: true });
      } catch {}
    }
  }, [nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { accessToken, refreshToken } = await login(email, password);
      if (!accessToken) throw new Error("Access token not found.");
      localStorage.setItem(
        "auth.tokens",
        JSON.stringify({ accessToken, refreshToken })
      );
      nav("/home");
    } catch (e: any) {
      const msg =
        e?.response?.data?.detail ||
        e?.response?.data?.message ||
        e?.message ||
        "Failed to sign in.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-[#f6f7f9] px-6">
      <Card className="w-full max-w-[450px] rounded-[16px] shadow-[0_24px_60px_rgba(7,24,46,0.15)]">
        <CardContent className="pt-10 pb-8 px-8 sm:px-10">
          <CardHeader>
            <img src={Logo} alt="b2bit" className="mx-auto mb-7 w-[300px]" />
          </CardHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[14px] font-semibold text-[#2a2e33]">
                E-mail
              </Label>
              <Input
                type="email"
                placeholder="@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-[10px] bg-[#f1f3f6] border border-[#e7e9ed] text-[14px] placeholder:text-[#9aa3ad]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[14px] font-semibold text-[#2a2e33]">
                Password
              </Label>
              <Input
                type="password"
                placeholder="****************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-[10px] bg-[#f1f3f6] border border-[#e7e9ed] text-[14px] placeholder:text-[#9aa3ad]"
                required
              />
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[10px] bg-[#092a4a] text-white font-bold hover:opacity-95 mouse:hover cursor-pointer"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
