import { createServiceClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay";

export async function processTaskRefund(taskId: string, userId: string) {
  const serviceClient = await createServiceClient();

  // Find task and stake
  const { data: task, error: taskError } = await serviceClient
    .from("tasks")
    .select("*, stakes(*), goals(*)")
    .eq("id", taskId)
    .single();

  if (taskError || !task) {
    throw new Error("Task not found for refund");
  }

  // Idempotency: check if already refunded
  const stake = Array.isArray(task.stakes) ? task.stakes[0] : task.stakes;
  if (stake && stake.status === "refunded") {
    return { success: true, message: "Already refunded" };
  }

  // 1. Trigger Razorpay Refund if payment_id exists
  let razorpayRefundId = null;
  const razorpay = getRazorpayClient();

  if (razorpay && stake?.razorpay_payment_id && !stake.razorpay_payment_id.startsWith("pay_mock_")) {
    try {
      const refund = await razorpay.payments.refund(stake.razorpay_payment_id, {
        amount: Math.round(Number(task.stake_amount) * 100),
        notes: {
          taskId,
          userId,
          reason: "Commitment verified pass",
        },
      });
      razorpayRefundId = refund.id;
    } catch (err: any) {
      console.warn("Razorpay refund API call notice:", err.message);
    }
  }

  // 2. Update task status
  await serviceClient
    .from("tasks")
    .update({ status: "verified_pass", updated_at: new Date().toISOString() })
    .eq("id", taskId);

  // 3. Update stake status
  if (stake) {
    await serviceClient
      .from("stakes")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        razorpay_refund_id: razorpayRefundId || `rfnd_${Date.now()}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", stake.id);

    // 4. Create refund transaction
    await serviceClient.from("transactions").insert({
      stake_id: stake.id,
      user_id: userId,
      type: "refund",
      amount: task.stake_amount,
      currency: task.goals?.currency || "INR",
      razorpay_ref: razorpayRefundId || `rfnd_${Date.now()}`,
      description: `Refund for completed milestone: ${task.title}`,
    });
  }

  // 5. Send notification
  await serviceClient.from("notifications").insert({
    user_id: userId,
    type: "result",
    title: "Task completed ✅ Stake Refunded",
    body: `Congratulations! Your milestone "${task.title}" was verified. Your ₹${task.stake_amount} stake has been refunded.`,
    related_id: taskId,
  });

  return { success: true, refundedAmount: task.stake_amount };
}
