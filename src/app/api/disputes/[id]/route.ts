import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { processTaskRefund } from "@/lib/payments/refund";
import { processTaskForfeiture } from "@/lib/payments/forfeit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from("users")
      .select("is_admin, email")
      .eq("id", user.id)
      .single();

    const isAdmin =
      profile?.is_admin ||
      user.email?.toLowerCase() === (process.env.ADMIN_EMAIL || "parthgholap18@gmail.com").toLowerCase();

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { resolution, admin_note } = await request.json();

    if (!resolution || !["resolved_in_favour", "resolved_against"].includes(resolution)) {
      return NextResponse.json({ error: "Invalid resolution status" }, { status: 400 });
    }

    const { data: dispute, error: fetchError } = await serviceClient
      .from("disputes")
      .select("*, tasks(*)")
      .eq("id", id)
      .single();

    if (fetchError || !dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });
    }

    // Update dispute record
    await serviceClient
      .from("disputes")
      .update({
        status: resolution,
        admin_note: admin_note || null,
        resolved_by: user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Apply decision to task & stake
    if (resolution === "resolved_in_favour") {
      await processTaskRefund(dispute.task_id, dispute.user_id);
    } else {
      await processTaskForfeiture(
        dispute.task_id,
        dispute.user_id,
        `Dispute resolved against user: ${admin_note || "Evidence insufficient"}`
      );
    }

    return NextResponse.json({ success: true, message: `Dispute ${resolution}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to resolve dispute" }, { status: 500 });
  }
}
