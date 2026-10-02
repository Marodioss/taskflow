"use client";
import { useState } from "react";
import { Task, TaskFilter } from "@/types/task";
import {
  createTaskAction,
  toggleTaskAction,
  deleteTaskAction,
} from "@/app/action";

interface TaskManagerProps {
  initialTasks: Task[];
}

export function TaskManager({ initialTasks }: TaskManagerProps) {
  const [inputTitle, setInputTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!inputTitle.trim()) return;
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
    } catch (error) {
      console.error("Failed to create task", error);
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

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Tasks</h2>
        <span className="text-sm font-medium text-slate-500">
          {tasks.filter((t) => t.completed).length} of {tasks.length} completed
        </span>
      </div>

      {/* Add Form */}
      <form onSubmit={handleAddTask} className="flex gap-2">
        <input
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          Add Task
        </button>
      </form>

      <div className="flex gap-2 border-b border-slate-100 pb-3">
        {(["all", "active", "completed"] as TaskFilter[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
              filter === tab
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Your <ul> list goes here */}

      <ul className="mt-4 divide-y divide-slate-100">
        {filteredTasks.length === 0 ? (
          <p className="text-center py-6 text-sm text-slate-400">
            No {filter} tasks.
          </p>
        ) : (
          filteredTasks.map((task) => (
            <li
              key={task.id}
              className="py-3 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                {/* 1. Checkbox for Toggle */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />

                {/* 2. Title with Strikethrough */}
                <span
                  className={
                    task.completed
                      ? "line-through text-slate-400"
                      : "text-slate-800"
                  }
                >
                  {task.title}
                </span>
              </div>

              {/* 3. Delete Button */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
