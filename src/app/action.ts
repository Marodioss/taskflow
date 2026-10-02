"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Create a task in PostgreSQL
export async function createTaskAction(title: string) {
  if (!title || !title.trim()) {
    throw new Error("Title cannot be empty");
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
    },
  });

  // Purges Next.js cache so the home page shows the new task immediately
  revalidatePath("/");
  return task;
}

// 2. Toggle a task in PostgreSQL
export async function toggleTaskAction(id: string, completed: boolean) {
  const task = await prisma.task.update({
    where: { id },
    data: { completed },
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
