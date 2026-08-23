import { createServiceClient } from "@/lib/supabase/server";

export async function processTaskForfeiture(taskId: string, userId: string, reason: string) {
  const serviceClient = await createServiceClient();

  const { data: task, error: taskError } = await serviceClient
    .from("tasks")
    .select("*, stakes(*), goals(*)")
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    throw new Error("Task not found for forfeiture");
  }

  const stake = Array.isArray(task.stakes) ? task.stakes[0] : task.stakes;
  if (stake && (stake.status === "forfeited" || stake.status === "refunded")) {
    return { success: true, message: "Stake already processed" };
  }

  // 1. Update task status
  await serviceClient
    .from("tasks")
    .update({ status: "verified_fail", updated_at: new Date().toISOString() })
    .eq("id", taskId);

  // 2. Update stake status
  if (stake) {
    await serviceClient
      .from("stakes")
      .update({
        status: "forfeited",
        forfeited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", stake.id);

    // 3. Create forfeiture transaction
    await serviceClient.from("transactions").insert({
      stake_id: stake.id,
      user_id: userId,
      type: "forfeiture",
      amount: task.stake_amount,
      currency: task.goals?.currency || "INR",
      description: `CommitX revenue: stake forfeited for "${task.title}" (${reason})`,
    });
  }

  // 4. Send notification
  await serviceClient.from("notifications").insert({
    user_id: userId,
    type: "result",
    title: "Milestone not verified — Stake forfeited",
    body: `Your milestone "${task.title}" was not verified. ₹${task.stake_amount} has been forfeited. You may file a dispute if you believe this was in error.`,
    related_id: taskId,
  });

  return { success: true, forfeitedAmount: task.stake_amount };
}
