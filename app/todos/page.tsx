import { clsx } from "clsx";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth, signIn, signOut } from "@/auth";
import type { Task, User } from "@prisma/client";

const PAGE_SIZE = 20;

const formatDate = (date: Date | null) =>
  date
    ? new Date(date).toLocaleDateString("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "No due date";

type TaskCreateData = {
  title: string;
  description?: string;
  dueDate?: Date;
  isDone: boolean;
  user?: { connect: { id: string } };
};

async function createTask(formData: FormData) {
  "use server";

  const session = await auth();
  const title = formData.get("title")?.toString()?.trim();
  const description = formData.get("description")?.toString().trim() || undefined;
  const dueDateValue = formData.get("dueDate")?.toString();

  if (!title) return;

  const data: TaskCreateData = { title, isDone: false };
  if (description) data.description = description;
  if (dueDateValue) data.dueDate = new Date(dueDateValue);
  if (session?.user?.id) {
    data.user = { connect: { id: session.user.id } };
  }

  await prisma.task.create({ data });
  revalidatePath("/todos");
}

async function signInAction() {
  "use server";
  await signIn("github");
}

async function signOutAction() {
  "use server";
  await signOut();
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
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

  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    skip,
    take: PAGE_SIZE,
  }) as (Task & { user: User | null })[];

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            To-Do Liste
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            Aufgaben und Verantwortliche
          </h1>
        </header>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
          {session ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-zinc-600">Angemeldet als</p>
                <p className="text-base font-semibold text-zinc-950">
                  {session.user?.name ?? session.user?.email}
                </p>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  Abmelden
                </button>
              </form>
            </div>
          ) : (
            <form action={signInAction}>
              <button
                type="submit"
                className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Mit GitHub anmelden
              </button>
            </form>
          )}
        </div>

        <form
          action={createTask}
          className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5"
        >
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Titel</label>
              <input
                type="text"
                name="title"
                required
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Neue Aufgabe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Beschreibung</label>
              <textarea
                name="description"
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Optional: Details zur Aufgabe"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Fälligkeitsdatum</label>
                <input
                  type="date"
                  name="dueDate"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Aufgabe erstellen
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {tasks.map((task: Task & { user: User | null }) => (
            <article
              key={task.id}
              className={clsx(
                "rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg",
                task.isDone ? "border-l-4 border-green-500 opacity-70" : "border-l-4 border-gray-300"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-zinc-950">{task.title}</h2>
                <span
                  className={clsx(
                    "rounded-full px-3 py-1 text-sm font-semibold",
                    task.isDone ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
                  )}
                >
                  {task.isDone ? "Erledigt" : "Offen"}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>Fällig: {formatDate(task.dueDate)}</p>
                <p>Von: {task.user ? task.user.name ?? task.user.email : "Nicht zugeordnet"}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            {page > 1 ? (
              <a
                href={`/todos?page=${page - 1}`}
                className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-200"
              >
                Previous
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-400 cursor-default" disabled>
                Previous
              </button>
            )}
          </div>

          <div className="text-sm text-zinc-600">Seite {page} von {totalPages}</div>

          <div>
            {page < totalPages ? (
              <a
                href={`/todos?page=${page + 1}`}
                className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Next
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-md bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-400 cursor-default" disabled>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
