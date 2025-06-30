import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const newRole = body.role as string;
  if (!newRole) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  // id берём из пути URL: /api/admin/users/{id}
  const id = req.nextUrl.pathname.split("/").pop();

  const { data, error } = await supabaseAdmin
    .from("next_auth.users")
    .update({ role: newRole })
    .eq("id", id)
    .select("id, role")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
