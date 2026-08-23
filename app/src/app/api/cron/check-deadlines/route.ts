import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { processTaskForfeiture } from "@/lib/payments/forfeit";

export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}

async function handleCron(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if set in production
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const serviceClient = await createServiceClient();
    const now = new Date().toISOString();

    // Query pending tasks whose deadline has passed
    const { data: expiredTasks, error } = await serviceClient
      .from("tasks")
      .select("id, user_id, title, deadline")
      .eq("status", "pending")
      .lt("deadline", now);

    if (error) {
      console.error("Cron query error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let forfeitedCount = 0;
    if (expiredTasks && expiredTasks.length > 0) {
      for (const task of expiredTasks) {
        try {
          await processTaskForfeiture(
            task.id,
            task.user_id,
            `Deadline expired (${new Date(task.deadline).toLocaleDateString()})`
          );
          forfeitedCount++;
        } catch (e) {
          console.error(`Failed to forfeit task ${task.id}:`, e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now,
      totalChecked: expiredTasks?.length || 0,
      forfeitedCount,
    });
  } catch (err: any) {
    console.error("Deadline cron job error:", err);
    return NextResponse.json({ error: err.message || "Cron execution failed" }, { status: 500 });
  }
}
