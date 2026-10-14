"use client";
import { Task, TaskFilter } from "@/types/task";
import { useTasks } from "@/hooks/useTasks";

interface TaskManagerProps {
  initialTasks: Task[];
}

export function TaskManager({ initialTasks }: TaskManagerProps) {
  const {
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
  } = useTasks(initialTasks);
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
          disabled={formState.status === "submitting"}
          className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer disabled:cursor-not-allowed"
        >
          {formState.status === "submitting" ? "Adding..." : "Add Task"}
        </button>
      </form>
      {formState.status === "error" && (
        <p className="text-xs text-red-600 font-medium">{formState.message}</p>
      )}

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
