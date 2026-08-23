import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { generateQuizQuestions } from "@/lib/gemini";
import { processTaskRefund } from "@/lib/payments/refund";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, taskId, goalId, topicTitle, topicDescription, score, passed } = body;

    if (action === "generate") {
      // 1. Generate 5 MCQs via Gemini API (Free)
      const questions = await generateQuizQuestions(topicTitle || "Study Material", topicDescription);

      // 2. Store in quiz_questions table
      if (taskId && questions.length > 0) {
        for (const q of questions) {
          await serviceClient.from("quiz_questions").insert({
            task_id: taskId,
            question: q.question,
            options: q.options,
            correct_option: q.correct_option,
            explanation: q.explanation,
          });
        }
      }

      return NextResponse.json({ questions });
    } else if (action === "evaluate") {
      const status = passed ? "auto_approved" : "auto_rejected";

      // Insert submission record
      await serviceClient.from("submissions").insert({
        task_id: taskId,
        user_id: user.id,
        quiz_score: score,
        quiz_attempted: true,
        status,
        submitted_at: new Date().toISOString(),
      });

      if (passed) {
        // Trigger refund
        await processTaskRefund(taskId, user.id);
      }

      return NextResponse.json({
        success: true,
        score,
        passed,
        status,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Quiz API error:", err);
    return NextResponse.json({ error: err.message || "Quiz process failed" }, { status: 500 });
  }
}
