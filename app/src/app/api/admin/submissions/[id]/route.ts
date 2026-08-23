import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { processTaskRefund } from "@/lib/payments/refund";
import { processTaskForfeiture } from "@/lib/payments/forfeit";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: submissionId } = await params;
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

    const { action, reviewer_note } = await request.json();

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { data: submission, error: subError } = await serviceClient
      .from("submissions")
      .select("*, tasks(*)")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    // Update submission record
    await serviceClient
      .from("submissions")
      .update({
        status: newStatus,
        reviewer_id: user.id,
        reviewer_note: reviewer_note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    // Apply refund or forfeiture
    if (action === "approve") {
      await processTaskRefund(submission.task_id, submission.user_id);
    } else {
      await processTaskForfeiture(
        submission.task_id,
        submission.user_id,
        reviewer_note || "Manual review rejected"
      );
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      message: `Submission ${newStatus}`,
    });
  } catch (err: any) {
    console.error("Admin review submission error:", err);
    return NextResponse.json({ error: err.message || "Failed to process review" }, { status: 500 });
  }
}
