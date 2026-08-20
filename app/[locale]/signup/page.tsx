import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { registerAction, signInWithGoogle } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function SignupPage() {
  const session = await auth();
  if (session) redirect("/todos");
  const t = await getTranslations();
  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-md ring-1 ring-black/5">
        <header className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-zinc-500">
            {t("common.appName")}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
            {t("common.createAccount")}
          </h1>
        </header>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.46H12v4.66h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1C3.25 21.3 7.31 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.88 12c0-.79.14-1.56.39-2.28V6.62H1.27A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.45-3.45C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.62l4 3.1C6.22 6.86 8.87 4.75 12 4.75z"/>
            </svg>
            Google
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-400">{t("common.or")}</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">{t("common.name")}</label>
            <input
              type="text"
              name="name"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder="Max Mustermann"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">{t("common.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder={t("common.email")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">{t("common.password")}</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              placeholder={t("common.password")}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            {t("common.register")}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-600">
          {t("common.alreadyAccount")}{" "}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            {t("common.login")}
          </Link>
        </p>
      </div>
    </main>
  );
}
