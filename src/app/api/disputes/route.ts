import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: disputes, error } = await supabase
      .from("disputes")
      .select("*, tasks(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ disputes: disputes || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch disputes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, submissionId, reason } = await request.json();

    if (!taskId || !reason) {
      return NextResponse.json({ error: "Missing required dispute information" }, { status: 400 });
    }

    // Create dispute record
    const { data: dispute, error: disputeError } = await serviceClient
      .from("disputes")
      .insert({
        task_id: taskId,
        submission_id: submissionId || null,
        user_id: user.id,
        reason,
        status: "open",
      })
      .select()
      .single();

    if (disputeError) {
      return NextResponse.json({ error: disputeError.message }, { status: 500 });
    }

    // Update task status to disputed
    await serviceClient
      .from("tasks")
      .update({ status: "disputed", updated_at: new Date().toISOString() })
      .eq("id", taskId);

    // Send confirmation notification
    await serviceClient.from("notifications").insert({
      user_id: user.id,
      type: "dispute_update",
      title: "Dispute Received",
      body: "We have received your dispute and our team will review your evidence within 48 hours.",
      related_id: taskId,
    });

    return NextResponse.json({ success: true, dispute });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create dispute" }, { status: 500 });
  }
}
