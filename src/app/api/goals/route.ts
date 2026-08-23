import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createGoalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.enum(["generic_habit", "study", "business_creative"]),
  total_stake: z.number().min(100, "Minimum stake is ₹100").max(10000, "Maximum stake is ₹10,000"),
  currency: z.string().default("INR"),
  start_date: z.string(),
  end_date: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: goals, error } = await supabase
      .from("goals")
      .select(`
        *,
        tasks (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goals: goals || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = createGoalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
    }

    const { title, description, category, total_stake, currency, start_date, end_date } = validation.data;

    const { data: goal, error } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        category,
        total_stake,
        currency,
        start_date,
        end_date,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ goal }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
