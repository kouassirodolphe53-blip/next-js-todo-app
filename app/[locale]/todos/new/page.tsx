import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTask } from "@/lib/actions";

export default async function NewTaskPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 py-12 px-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/todos" className="text-sm text-indigo-600 hover:underline">
          ← Zurück zur Liste
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
          <h1 className="text-2xl font-semibold text-zinc-950 mb-6">
            Neue Aufgabe erstellen
          </h1>

          <form action={createTask} className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Titel *</label>
              <input
                type="text"
                name="title"
                required
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Aufgabentitel eingeben..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Beschreibung</label>
              <textarea
                name="description"
                rows={3}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                placeholder="Beschreibung eingeben..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-700">Status</label>
                <select
                  name="status"
                  defaultValue="OFFEN"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="OFFEN">Offen</option>
                  <option value="IN_ARBEIT">In Arbeit</option>
                  <option value="ERLEDIGT">Erledigt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Zugewiesen an (optional)</label>
                <select
                  name="userId"
                  defaultValue=""
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Benutzer auswählen</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name ?? u.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Fälligkeitsdatum</label>
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
              Speichern
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}