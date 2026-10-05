"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createTaskSchema, toggleTaskSchema } from "@/lib/validations/tasks";

// 1. Create a task in PostgreSQL

export async function createTaskAction(title: string) {
  const parsed = createTaskSchema.safeParse({ title });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
    },
  });

  // Purges Next.js cache so the home page shows the new task immediately
  revalidatePath("/");
  return task;
}

// 2. Toggle a task in PostgreSQL
export async function toggleTaskAction(id: string, completed: boolean) {
  const parsed = toggleTaskSchema.safeParse({ id, completed });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message);
  }
  const task = await prisma.task.update({
    where: { id: parsed.data.id },
    data: { completed: parsed.data.completed },
  });

  revalidatePath("/");
  return task;
}

// 3. Delete a task from PostgreSQL
export async function deleteTaskAction(id: string) {
  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/");
}
