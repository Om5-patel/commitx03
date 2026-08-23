import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { processTaskRefund } from "@/lib/payments/refund";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const serviceClient = await createServiceClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId, goalId, imageData, gps_lat, gps_lng, submitted_at } = await request.json();

    if (!taskId || !imageData) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });
    }

    // Compute perceptual hash (simulated through sha256 of image sample)
    const imageHash = crypto.createHash("sha256").update(imageData.slice(0, 5000)).digest("hex");

    // Check duplicate hash against previous submissions by this user
    const { data: previousSubmissions } = await serviceClient
      .from("submissions")
      .select("image_hash")
      .eq("user_id", user.id)
      .eq("image_hash", imageHash);

    const isDuplicate = previousSubmissions && previousSubmissions.length > 0;
    const status = isDuplicate ? "manual_review" : "auto_approved";

    // Insert submission record
    const { data: submission, error: subError } = await serviceClient
      .from("submissions")
      .insert({
        task_id: taskId,
        user_id: user.id,
        media_type: "image",
        gps_lat: gps_lat || null,
        gps_lng: gps_lng || null,
        image_hash: imageHash,
        status,
        submitted_at: submitted_at || new Date().toISOString(),
      })
      .select()
      .single();

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    // If auto_approved, trigger automatic refund!
    if (status === "auto_approved") {
      await processTaskRefund(taskId, user.id);
    }

    return NextResponse.json({
      success: true,
      status,
      message: status === "auto_approved" ? "Photo verified pass. Stake refunded." : "Flagged for manual review.",
    });
  } catch (err: any) {
    console.error("Photo verification error:", err);
    return NextResponse.json({ error: err.message || "Verification failed" }, { status: 500 });
  }
}
