"use client";
import { useState } from "react";
import { Task, TaskFilter } from "@/types/task";

interface TaskManagerProps {
  initialTasks: Task[];
}

export function TaskManager({ initialTasks }: TaskManagerProps) {
  const [inputTitle, setInputTitle] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault(); // Rule: Stops browser from reloading the page
    if (!inputTitle.trim()) return; // Rule: Guard against empty strings
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: inputTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setInputTitle("");
  }
  // Toggle: .map() returns a new array with just the target item updated
  function handleToggleTask(id: string) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  // Delete: .filter() returns a new array excluding the target item
  function handleDeleteTask(id: string) {
    setTasks(tasks.filter((task) => task.id !== id));
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
