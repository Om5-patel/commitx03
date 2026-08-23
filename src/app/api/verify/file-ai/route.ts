import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkFileArtifactRelevance } from "@/lib/gemini";
import { processTaskRefund } from "@/lib/payments/refund";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, goalId, taskTitle, taskDescription, submittedContent } = await request.json();

    if (!taskId || !submittedContent) {
      return NextResponse.json({ error: "Missing required submission data" }, { status: 400 });
    }

    // Run Gemini AI evaluation (Free tier)
    const evaluation = await checkFileArtifactRelevance(
      taskTitle || "Milestone Deliverable",
      taskDescription,
      submittedContent
    );

    // Record submission
    await serviceClient.from("submissions").insert({
      task_id: taskId,
      user_id: user.id,
      ai_relevance_score: evaluation.score,
      ai_relevance_note: evaluation.explanation,
      status: evaluation.status,
      submitted_at: new Date().toISOString(),
    });

    // If auto_approved (score >= 0.70), trigger refund
    if (evaluation.status === "auto_approved") {
      await processTaskRefund(taskId, user.id);
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (err: any) {
    console.error("File verification error:", err);
    return NextResponse.json({ error: err.message || "File check failed" }, { status: 500 });
  }
}
