import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      goal_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      is_mock,
    } = await request.json();

    if (!goal_id || !razorpay_order_id) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Verify signature if real Razorpay is used
    if (!is_mock && process.env.RAZORPAY_KEY_SECRET) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Fetch goal and its tasks
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("*, tasks(*)")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const paymentId = razorpay_payment_id || `pay_mock_${crypto.randomBytes(8).toString("hex")}`;

    // Create stake records for each task
    if (goal.tasks && goal.tasks.length > 0) {
      for (const task of goal.tasks) {
        const { data: stake, error: stakeError } = await serviceClient
          .from("stakes")
          .insert({
            task_id: task.id,
            user_id: user.id,
            amount: task.stake_amount,
            currency: goal.currency || "INR",
            status: "held",
            razorpay_order_id,
            razorpay_payment_id: paymentId,
          })
          .select()
          .single();

        if (!stakeError && stake) {
          // Record deposit transaction
          await serviceClient.from("transactions").insert({
            stake_id: stake.id,
            user_id: user.id,
            type: "deposit",
            amount: task.stake_amount,
            currency: goal.currency || "INR",
            razorpay_ref: paymentId,
            description: `Stake deposited for: ${task.title}`,
          });
        }
      }
    }

    // Update goal status to active
    await serviceClient
      .from("goals")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("id", goal_id);

    // Send notification
    await serviceClient.from("notifications").insert({
      user_id: user.id,
      type: "payment_confirmed",
      title: "Your commitment is locked in 🔒",
      body: `Your stake of ₹${goal.total_stake} for "${goal.title}" has been placed in trust. Time to get to work!`,
      related_id: goal_id,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified and stake locked.",
    });
  } catch (err: any) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 });
  }
}
