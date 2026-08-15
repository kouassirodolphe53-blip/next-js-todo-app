import Link from "next/link";
import { clsx } from "clsx";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Task, User, Category, Tag, Status } from "@prisma/client";

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
  const getParam = (key: string) => {
    const v = resolvedSearchParams?.[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const rawPage = getParam("page");
  let page = parseInt(String(rawPage ?? "1"), 10);
  if (Number.isNaN(page) || page < 1) page = 1;

  const statusFilter = getParam("status") || "";
  const categoryFilter = getParam("categoryId") || "";
  const tagFilter = getParam("tagId") || "";

  const where: {
    status?: Status;
    categoryId?: number;
    tags?: { some: { id: number } };
  } = {};
  if (statusFilter) where.status = statusFilter as Status;
  if (categoryFilter) where.categoryId = parseInt(categoryFilter, 10);
  if (tagFilter) where.tags = { some: { id: parseInt(tagFilter, 10) } };

  const totalCount = await prisma.task.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  if (page > totalPages) page = totalPages;

  const skip = (page - 1) * PAGE_SIZE;

  const [tasks, categories, tags] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { user: true, category: true, tags: true },
      skip,
      take: PAGE_SIZE,
    }) as Promise<(Task & { user: User | null; category: Category | null; tags: Tag[] })[]>,
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const buildFilterUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams();
    const merged = { status: statusFilter, categoryId: categoryFilter, tagId: tagFilter, ...overrides };
    if (merged.status) p.set("status", merged.status);
    if (merged.categoryId) p.set("categoryId", merged.categoryId);
    if (merged.tagId) p.set("tagId", merged.tagId);
    const qs = p.toString();
    return `/todos${qs ? `?${qs}` : ""}`;
  };

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

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
          <p className="text-sm font-semibold text-zinc-700 mb-3">{t("dashboard.filters")}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">{t("taskForm.status")}</label>
              <div className="flex flex-wrap gap-2">
                <a href={buildFilterUrl({ status: "" })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", !statusFilter ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                  {t("dashboard.all")}
                </a>
                {(["OFFEN", "IN_ARBEIT", "ERLEDIGT"] as const).map((s) => (
                  <a key={s} href={buildFilterUrl({ status: s })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", statusFilter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                    {statusLabel[s]}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">{t("taskForm.category")}</label>
              <div className="flex flex-wrap gap-2">
                <a href={buildFilterUrl({ categoryId: "" })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", !categoryFilter ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                  {t("dashboard.all")}
                </a>
                {categories.map((c) => (
                  <a key={c.id} href={buildFilterUrl({ categoryId: String(c.id) })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", categoryFilter === String(c.id) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                    {c.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">{t("taskForm.tags")}</label>
              <div className="flex flex-wrap gap-2">
                <a href={buildFilterUrl({ tagId: "" })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", !tagFilter ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                  {t("dashboard.all")}
                </a>
                {tags.map((tag) => (
                  <a key={tag.id} href={buildFilterUrl({ tagId: String(tag.id) })} className={clsx("rounded-full px-3 py-1 text-xs font-semibold", tagFilter === String(tag.id) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700")}>
                    #{tag.name}
                  </a>
                ))}
              </div>
            </div>
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
                {task.category && <p>{t("taskForm.category")}: {task.category.name}</p>}
              </div>
              {task.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span key={tag.id} className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-600">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
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
