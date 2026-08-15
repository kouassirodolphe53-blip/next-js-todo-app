import Link from "next/link";
import { clsx } from "clsx";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Task, User } from "@prisma/client";

const PAGE_SIZE = 20;

const localeMap: Record<string, string> = {
  de: "de-DE",
  en: "en-US",
  fr: "fr-FR",
};

export default async function TodosPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const t = await getTranslations();

  const statusLabel: Record<string, string> = {
    OFFEN: t("taskForm.statusOpen"),
    IN_ARBEIT: t("taskForm.statusInProgress"),
    ERLEDIGT: t("taskForm.statusDone"),
  };

  const statusStyle: Record<string, string> = {
    OFFEN: "bg-gray-200 text-gray-700",
    IN_ARBEIT: "bg-amber-100 text-amber-700",
    ERLEDIGT: "bg-green-500 text-white",
  };

  const formatDate = (date: Date | null) =>
    date
      ? new Date(date).toLocaleDateString(localeMap[locale] ?? "de-DE", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : t("dashboard.noDueDate");

  const resolvedSearchParams = await searchParams;
  const rawPage = Array.isArray(resolvedSearchParams?.page)
    ? resolvedSearchParams?.page[0]
    : resolvedSearchParams?.page;
  let page = parseInt(String(rawPage ?? "1"), 10);
  if (Number.isNaN(page) || page < 1) page = 1;

  const totalCount = await prisma.task.count();
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  if (page > totalPages) page = totalPages;

  const skip = (page - 1) * PAGE_SIZE;

  const tasks = (await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    skip,
    take: PAGE_SIZE,
  })) as (Task & { user: User | null })[];

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {t("common.appName")}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            {t("dashboard.title")}
          </h1>
        </header>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-zinc-600">{t("dashboard.loggedInAs")}</p>
            <p className="text-base font-semibold text-zinc-950">
              {session.user?.name ?? session.user?.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/todos/new"
              className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              {t("dashboard.newTask")}
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {t("common.logout")}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.length === 0 && (
            <p className="text-center text-zinc-500 py-8">
              {t("dashboard.noTasks")}
            </p>
          )}

          {tasks.map((task) => (
            <Link
              key={task.id}
              href={`/todos/${task.id}/edit`}
              className={clsx(
                "block rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg",
                task.status === "ERLEDIGT"
                  ? "border-l-4 border-green-500 opacity-70"
                  : "border-l-4 border-gray-300"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-zinc-950">{task.title}</h2>
                <span
                  className={clsx(
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    statusStyle[task.status]
                  )}
                >
                  {statusLabel[task.status]}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>{t("dashboard.dueDate")}: {formatDate(task.dueDate)}</p>
                <p>{t("dashboard.assignedTo")}: {task.user ? task.user.name ?? task.user.email : t("dashboard.unassigned")}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            {page > 1 ? (
              <a
                href={`/todos?page=${page - 1}`}
                className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-200"
              >
                {t("dashboard.back")}
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-400 cursor-default" disabled>
                {t("dashboard.back")}
              </button>
            )}
          </div>

          <div className="text-sm text-zinc-600">
            {t("dashboard.pageInfo", { page, totalPages })}
          </div>

          <div>
            {page < totalPages ? (
              <a
                href={`/todos?page=${page + 1}`}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {t("dashboard.next")}
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-400 cursor-default" disabled>
                {t("dashboard.next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
