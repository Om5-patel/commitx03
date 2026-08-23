import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const taskItemSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  verification_method: z.enum(["photo", "quiz", "file_ai"]),
  stake_amount: z.number().min(0, "Stake amount must be non-negative"),
  deadline: z.string(),
  order_index: z.number().default(0),
});

const createTasksSchema = z.object({
  tasks: z.array(taskItemSchema).min(1, "At least one task is required"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goal_id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        *,
        submissions (*),
        stakes (*)
      `)
      .eq("goal_id", goal_id)
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: tasks || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: goal_id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify goal belongs to user
    const { data: goal, error: goalError } = await supabase
      .from("goals")
      .select("id")
      .eq("id", goal_id)
      .eq("user_id", user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const body = await request.json();
    const validation = createTasksSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
    }

    const tasksToInsert = validation.data.tasks.map((task, index) => ({
      goal_id,
      user_id: user.id,
      title: task.title,
      description: task.description || null,
      verification_method: task.verification_method,
      stake_amount: task.stake_amount,
      deadline: task.deadline,
      order_index: task.order_index ?? index,
      status: "pending",
    }));

    const { data: insertedTasks, error: insertError } = await supabase
      .from("tasks")
      .insert(tasksToInsert)
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ tasks: insertedTasks }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
