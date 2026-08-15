import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTask } from "@/lib/actions";
import { getTranslations } from "next-intl/server";

export default async function NewTaskPage() {
  const t = await getTranslations();

  const [users, categories] = await Promise.all([
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/todos" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-50">
          {t("taskForm.backToList")}
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold text-zinc-950 mb-6">
            {t("taskForm.newTaskTitle")}
          </h1>

          <form action={createTask} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.titleLabel")} *</label>
              <input
                type="text"
                name="title"
                required
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={t("taskForm.titlePlaceholder")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.description")}</label>
              <textarea
                name="description"
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder={t("taskForm.descriptionPlaceholder")}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">{t("taskForm.status")}</label>
                <select
                  name="status"
                  defaultValue="OFFEN"
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
                  defaultValue=""
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">{t("taskForm.category")}</label>
                <select
                  name="categoryId"
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">{t("taskForm.selectCategory")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">{t("taskForm.tags")}</label>
                <input
                  type="text"
                  name="tags"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder={t("taskForm.tagsPlaceholder")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">{t("taskForm.dueDateLabel")}</label>
              <input
                type="date"
                name="dueDate"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              {t("taskForm.save")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
