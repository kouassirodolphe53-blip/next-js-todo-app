import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTask, deleteTask } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (Number.isNaN(taskId)) notFound();

  const t = await getTranslations();

  const [task, users] = await Promise.all([
    prisma.task.findUnique({ where: { id: taskId } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!task) notFound();

  const updateTaskWithId = updateTask.bind(null, taskId);

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/todos" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-50">
          {t("taskForm.backToList")}
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold text-zinc-950 mb-6">
            {t("taskForm.editTaskTitle")}
          </h1>

          <form action={updateTaskWithId} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.titleLabel")} *</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={task.title}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.description")}</label>
              <textarea
                name="description"
                rows={3}
                defaultValue={task.description ?? ""}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">{t("taskForm.status")}</label>
                <select
                  name="status"
                  defaultValue={task.status}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="OFFEN">{t("taskForm.statusOpen")}</option>
                  <option value="IN_ARBEIT">{t("taskForm.statusInProgress")}</option>
                  <option value="ERLEDIGT">{t("taskForm.statusDone")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">{t("dashboard.assignedTo")} ({t("taskForm.optional")})</label>
                <select
                  name="userId"
                  defaultValue={task.userId ?? ""}
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">{t("taskForm.selectUser")}</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name ?? u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.dueDateLabel")}</label>
              <input
                type="date"
                name="dueDate"
                defaultValue={task.dueDate ? task.dueDate.toISOString().slice(0, 10) : ""}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {t("taskForm.saveChanges")}
            </button>
          </form>

          <form action={deleteTask.bind(null, task.id)} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              {t("taskForm.delete")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
