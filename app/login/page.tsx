import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signInAction } from "@/lib/actions";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/todos");

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
        <header className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            To-Do Liste
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            Aufgaben und Verantwortliche
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Melde dich an, um deine Aufgaben zu verwalten.
          </p>
        </header>

        <form action={signInAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="deine@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Passwort</label>
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Anmelden
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-600">
          Noch kein Konto?{" "}
          <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
            Registrieren
          </Link>
        </p>
      </div>
    </main>
  );
}