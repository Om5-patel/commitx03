import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal_id, amount, currency = "INR" } = await request.json();

    if (!goal_id || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify goal belongs to user
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("*")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const razorpay = getRazorpayClient();

    if (razorpay) {
      // Create real Razorpay order (in paise, 1 INR = 100 paise)
      const options = {
        amount: Math.round(amount * 100),
        currency,
        receipt: `goal_${goal_id.slice(0, 16)}`,
        notes: {
          goal_id,
          user_id: user.id,
        },
      };

      const order = await razorpay.orders.create(options);
      return NextResponse.json({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
        is_mock: false,
      });
    } else {
      // Fallback Mock Order for development when Razorpay keys are not yet configured
      const mockOrderId = `order_mock_${crypto.randomBytes(8).toString("hex")}`;
      return NextResponse.json({
        order_id: mockOrderId,
        amount: Math.round(amount * 100),
        currency,
        key_id: "rzp_test_mockKey",
        is_mock: true,
      });
    }
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
