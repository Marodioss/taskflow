import { Task, TaskFilter } from "@/types/task";
import { useState } from "react";
import {
  createTaskAction,
  toggleTaskAction,
  deleteTaskAction,
} from "@/app/action";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

export function useTasks(initialTasks: Task[]) {
  const [inputTitle, setInputTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [formState, setFormState] = useState<FormState>({ status: "idle" });

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!inputTitle.trim()) return;
    setFormState({ status: "submitting" });
    const title = inputTitle.trim();
    setInputTitle(""); // Clear input immediately for snappy UX
    try {
      const created = await createTaskAction(title);
      const newTask: Task = {
        id: created.id,
        title: created.title,
        completed: created.completed,
        createdAt: created.createdAt.toISOString(),
      };
      setTasks([newTask, ...tasks]);
      setFormState({ status: "idle" });
    } catch (error) {
      setFormState({
        status: "error",
        message: error instanceof Error ? error.message : "Failed to add task",
      });
    }
  }
  // Toggle: .map() returns a new array with just the target item updated
  async function handleToggleTask(id: string) {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextStatus = !target.completed;
    // Step 1: Update UI instantly
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: nextStatus } : t)),
    );
    // Step 2: Persist to Postgres
    try {
      await toggleTaskAction(id, nextStatus);
    } catch (error) {
      console.error("Failed to toggle task", error);
      // Revert if DB write fails
      setTasks(
        tasks.map((t) => (t.id === id ? { ...t, completed: !nextStatus } : t)),
      );
    }
  }

  // Delete: .filter() returns a new array excluding the target item
  async function handleDeleteTask(id: string) {
    const previousTasks = tasks;
    // Step 1: Remove from UI instantly
    setTasks(tasks.filter((t) => t.id !== id));
    // Step 2: Delete from Postgres
    try {
      await deleteTaskAction(id);
    } catch (error) {
      console.error("Failed to delete task", error);
      setTasks(previousTasks); // Revert if DB write fails
    }
  }
  const [filter, setFilter] = useState<TaskFilter>("all");
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    formState,
    inputTitle,
    setInputTitle,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  };
}
