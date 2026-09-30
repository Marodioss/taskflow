import { TaskManager } from "@/components/TaskManager";
import { prisma } from "@/lib/prisma";
import type { Task as DbTask } from "@prisma/client";

export default async function Home() {
  const dbTasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  const initialTasks = dbTasks.map((t: DbTask) => ({
    id: t.id,
    title: t.title,
    completed: t.completed,
    createdAt: t.createdAt.toISOString(),
  }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                TaskFlow
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Full-Stack Task & Project Management Engine
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              v1.0 Reboot
            </span>
          </div>
        </header>

        {/* Status Card */}
        <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Project Status
          </h2>
          <p className="mt-1 text-slate-600 text-sm">
            Next.js App Router + TypeScript + Tailwind CSS initialized.
          </p>
          <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500">
            <span className="bg-slate-100 px-2.5 py-1 rounded">React 19</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">Next.js 16</span>
            <span className="bg-slate-100 px-2.5 py-1 rounded">
              Tailwind v4
            </span>
          </div>
        </section>

        <TaskManager initialTasks={initialTasks} />
      </div>
    </main>
  );
}
