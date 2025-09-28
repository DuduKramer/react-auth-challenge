import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "@/api/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("auth.tokens");
    const accessToken = raw ? JSON.parse(raw).accessToken : null;
    if (!accessToken) { nav("/login"); return; }

    getProfile()
      .then(setProfile)
      .catch(() => { localStorage.removeItem("auth.tokens"); nav("/login"); })
      .finally(() => setLoading(false));
  }, [nav]);

  function logout() {
    localStorage.removeItem("auth.tokens");
    nav("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eef3f8]">
        <div className="h-[72px] flex justify-end items-center px-8" />
        <div className="grid place-items-center p-10">Loading…</div>
      </div>
    );
  }
  if (!profile) return null;

  const avatarUrl =
    profile?.avatar?.high || profile?.avatar?.medium || profile?.avatar?.low || "";
  const initials = (profile?.name || "U").split(" ").map((p: string) => p[0]).slice(0,2).join("");

  return (
    <div className="min-h-screen bg-[#eef3f8]">
      
      <header className="h-[60px] bg-white shadow-sm flex items-center justify-end px-8">
        <Button className="h-10 px-24 rounded-[7px] bg-[#092a4a] font-bold hover:opacity-95 cursor-pointer" onClick={logout}>
          Logout
        </Button>
      </header>

     
      <div className="flex justify-center px-4 pb-20 ">
        <Card
          className="
            w-full max-w-[400px]
            rounded-[16px]
            shadow-[0_24px_60px_rgba(7,24,46,0.12)]
            border-0
            top-[70px]
            relative
            bg-white
          "
        >
          <CardContent className="px-10 py-8">
            <p className="text-center text-[13px] text-[#1f2937]">Profile picture</p>

            <div className="flex justify-center my-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>

          
            <div className="mt-2">
              <p className="text-sm text-[#5b6470]">
                Your <b className="text-[#1f2328]">Name</b>
              </p>
              <div
                className="
                  mt-2 h-12
                  rounded-[10px]
                  bg-[#f1f3f6]
                  border border-[#e7e9ed]
                  px-4 flex items-center
                  text-[14px] text-[#3a4047]
                "
              >
                {profile?.name || "--"}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm text-[#5b6470]">
                Your <b className="text-[#1f2328]">E-mail</b>
              </p>
              <div
                className="
                  mt-2 h-12
                  rounded-[10px]
                  bg-[#f1f3f6]
                  border border-[#e7e9ed]
                  px-4 flex items-center
                  text-[14px] text-[#3a4047]
                "
              >
                {profile?.email || "--"}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
