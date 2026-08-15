import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { registerAction } from "@/lib/actions";
import Link from "next/link";

export default async function SignupPage() {
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
            Konto erstellen
          </h1>
        </header>

        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Name</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Max Mustermann"
            />
          </div>

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
              minLength={8}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Registrieren
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-600">
          Bereits ein Konto?{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </main>
  );
}