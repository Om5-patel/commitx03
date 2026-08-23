import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if user profile exists, create if not
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingUser) {
        const isAdmin =
          data.user.email?.toLowerCase() ===
          (process.env.ADMIN_EMAIL || "").toLowerCase();

        await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          phone: data.user.user_metadata?.phone || null,
          full_name: data.user.user_metadata?.full_name || "User",
          is_admin: isAdmin,
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
